# ==============================================================================
# TERRAFORM MAIN CONFIGURATION - NODE.JS TUTORIAL APPLICATION
# ==============================================================================
# This file provisions the core infrastructure for a Node.js tutorial application
# featuring a single /hello endpoint. The infrastructure includes:
# - AWS EC2 instance for hosting the Node.js Express application
# - Security group for network access control (HTTP on port 3000)
# - Optional SSH key pair for server administration
# - User data script for automated application deployment
#
# EDUCATIONAL FOCUS:
# This configuration demonstrates Infrastructure as Code (IaC) best practices
# while maintaining simplicity appropriate for learning Node.js deployment concepts.
# ==============================================================================

# ------------------------------------------------------------------------------
# TERRAFORM AND PROVIDER CONFIGURATION
# ------------------------------------------------------------------------------

terraform {
  required_version = ">= 1.0.0"
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    
    local = {
      source  = "hashicorp/local"
      version = "~> 2.0"
    }
    
    random = {
      source  = "hashicorp/random"
      version = "~> 3.0"
    }
  }
}

# AWS Provider Configuration
# Configures the AWS provider with the specified region from variables
provider "aws" {
  region = var.region
  
  # Default tags applied to all resources created by this provider
  default_tags {
    tags = merge(var.tags, {
      "ManagedBy"   = "Terraform"
      "Project"     = var.resource_prefix
      "Environment" = var.environment
    })
  }
}

# ------------------------------------------------------------------------------
# DATA SOURCES FOR DYNAMIC RESOURCE DISCOVERY
# ------------------------------------------------------------------------------

# Latest Amazon Linux 2023 AMI
# Educational Note: Data sources query existing infrastructure to make 
# configurations dynamic and maintainable. This AMI includes Node.js prerequisites.
data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]
  
  filter {
    name   = "name"
    values = ["al2023-ami-*-x86_64"]
  }
  
  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
  
  filter {
    name   = "state"
    values = ["available"]
  }
}

# Available Availability Zones
# Used for subnet selection and multi-AZ deployments
data "aws_availability_zones" "available" {
  state = "available"
  
  filter {
    name   = "opt-in-status"
    values = ["opt-in-not-required"]
  }
}

# Default VPC (if custom VPC not specified)
# Educational Note: Most AWS accounts have a default VPC that simplifies initial deployments
data "aws_vpc" "default" {
  count   = var.vpc_id == "" ? 1 : 0
  default = true
}

# Default subnets in the VPC
data "aws_subnets" "default" {
  count = var.vpc_id == "" && length(var.public_subnet_ids) == 0 ? 1 : 0
  
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default[0].id]
  }
  
  filter {
    name   = "default-for-az"
    values = ["true"]
  }
}

# ------------------------------------------------------------------------------
# LOCAL VALUES FOR RESOURCE CONFIGURATION
# ------------------------------------------------------------------------------

locals {
  # Determine VPC ID to use (custom or default)
  vpc_id = var.vpc_id != "" ? var.vpc_id : (
    length(data.aws_vpc.default) > 0 ? data.aws_vpc.default[0].id : ""
  )
  
  # Determine subnet IDs to use (custom or default)
  subnet_ids = length(var.public_subnet_ids) > 0 ? var.public_subnet_ids : (
    length(data.aws_subnets.default) > 0 ? data.aws_subnets.default[0].ids : []
  )
  
  # Resource naming convention
  name_prefix = "${var.resource_prefix}-${var.environment}"
  
  # Combined tags for all resources
  common_tags = merge(var.tags, {
    "Name"        = "${local.name_prefix}-nodejs-tutorial"
    "Application" = "nodejs-hello-world"
    "Component"   = "infrastructure"
    "CreatedBy"   = "terraform"
  })
  
  # User data script for EC2 instance initialization
  # This script installs Node.js, clones a sample repository, and starts the application
  user_data = base64encode(templatefile("${path.module}/user-data.sh", {
    project_name = var.resource_prefix
    environment  = var.environment
  }))
}

# ------------------------------------------------------------------------------
# SECURITY GROUP FOR NETWORK ACCESS CONTROL
# ------------------------------------------------------------------------------

# Security Group for Node.js Tutorial Application
# Educational Note: Security groups act as virtual firewalls controlling network traffic
resource "aws_security_group" "nodejs_tutorial_sg" {
  name_prefix = "${local.name_prefix}-sg"
  description = "Security group for Node.js tutorial application - allows HTTP on port 3000"
  
  vpc_id = local.vpc_id
  
  # Inbound Rules
  # Allow HTTP traffic on port 3000 from anywhere (for educational purposes)
  # Educational Note: In production, restrict source IP ranges for security
  ingress {
    description = "HTTP traffic for Node.js application"
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    
    # For production environments, consider restricting to specific CIDR blocks:
    # cidr_blocks = var.allowed_cidr_blocks
  }
  
  # Allow SSH access for server administration (optional, for educational purposes)
  ingress {
    description = "SSH access for server administration"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    
    # Educational Note: In production, restrict SSH access to specific IP addresses
    # cidr_blocks = ["YOUR_IP_ADDRESS/32"]
  }
  
  # Outbound Rules
  # Allow all outbound traffic (required for package installation and updates)
  egress {
    description = "All outbound traffic for package installation and updates"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  tags = merge(local.common_tags, {
    "Name"        = "${local.name_prefix}-security-group"
    "Description" = "Network security for Node.js tutorial application"
  })
}

# ------------------------------------------------------------------------------
# SSH KEY PAIR FOR INSTANCE ACCESS (OPTIONAL)
# ------------------------------------------------------------------------------

# Generate SSH key pair for educational purposes
# Educational Note: SSH keys provide secure authentication for server access
resource "tls_private_key" "nodejs_tutorial_key" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

# AWS Key Pair resource
resource "aws_key_pair" "nodejs_tutorial_keypair" {
  key_name   = "${local.name_prefix}-keypair"
  public_key = tls_private_key.nodejs_tutorial_key.public_key_openssh
  
  tags = merge(local.common_tags, {
    "Name"        = "${local.name_prefix}-keypair"
    "Description" = "SSH key pair for Node.js tutorial server access"
  })
}

# Save private key to local file for educational purposes
# Educational Note: In production, use secure key management systems
resource "local_sensitive_file" "private_key" {
  content  = tls_private_key.nodejs_tutorial_key.private_key_pem
  filename = "${path.module}/nodejs-tutorial-key.pem"
  
  # Set appropriate file permissions for SSH private key
  file_permission = "0600"
}

# ------------------------------------------------------------------------------
# EC2 INSTANCE FOR NODE.JS APPLICATION HOSTING
# ------------------------------------------------------------------------------

# EC2 Instance for Node.js Tutorial Application
# Educational Note: This instance will host the Node.js Express server
resource "aws_instance" "nodejs_tutorial" {
  # Instance Configuration
  ami           = data.aws_ami.amazon_linux.id
  instance_type = var.instance_type
  key_name      = aws_key_pair.nodejs_tutorial_keypair.key_name
  
  # Network Configuration
  vpc_security_group_ids      = [aws_security_group.nodejs_tutorial_sg.id]
  subnet_id                   = length(local.subnet_ids) > 0 ? local.subnet_ids[0] : null
  associate_public_ip_address = true
  
  # Storage Configuration
  root_block_device {
    volume_type           = "gp3"
    volume_size           = 8  # 8GB is sufficient for the tutorial application
    encrypted             = true
    delete_on_termination = true
    
    tags = merge(local.common_tags, {
      "Name"        = "${local.name_prefix}-root-volume"
      "Description" = "Root volume for Node.js tutorial instance"
    })
  }
  
  # User Data Script for Application Installation
  # Educational Note: User data runs during instance initialization
  user_data = templatefile("${path.module}/user-data.sh", {
    project_name = var.resource_prefix
    environment  = var.environment
    region       = var.region
  })
  
  # Instance Metadata Service Configuration (IMDSv2)
  # Educational Note: IMDSv2 provides enhanced security for instance metadata access
  metadata_options {
    http_endpoint               = "enabled"
    http_tokens                 = "required"  # Require IMDSv2
    http_put_response_hop_limit = 1
    instance_metadata_tags      = "enabled"
  }
  
  # Monitoring Configuration
  monitoring = true  # Enable detailed CloudWatch monitoring
  
  tags = merge(local.common_tags, {
    "Name"        = "${local.name_prefix}-instance"
    "Description" = "EC2 instance hosting Node.js tutorial application"
    "Service"     = "nodejs-express-server"
  })
  
  # Lifecycle Configuration
  lifecycle {
    create_before_destroy = true
    
    # Ignore changes to user_data to prevent unnecessary replacements
    ignore_changes = [
      user_data,
    ]
  }
  
  # Dependency Management
  depends_on = [
    aws_security_group.nodejs_tutorial_sg,
    aws_key_pair.nodejs_tutorial_keypair
  ]
}

# ------------------------------------------------------------------------------
# USER DATA SCRIPT FOR APPLICATION DEPLOYMENT
# ------------------------------------------------------------------------------

# Create user data script file
resource "local_file" "user_data_script" {
  content = templatefile("${path.module}/user-data-template.sh", {
    project_name = var.resource_prefix
    environment  = var.environment
    region       = var.region
  })
  
  filename = "${path.module}/user-data.sh"
  
  # Make script executable
  file_permission = "0755"
}

# ------------------------------------------------------------------------------
# APPLICATION HEALTH CHECK AND VALIDATION
# ------------------------------------------------------------------------------

# Wait for instance to be ready and application to start
# Educational Note: Null resource enables running provisioners without creating actual resources
resource "null_resource" "application_health_check" {
  # Trigger health check when instance changes
  triggers = {
    instance_id = aws_instance.nodejs_tutorial.id
    public_ip   = aws_instance.nodejs_tutorial.public_ip
  }
  
  # Wait for instance to be reachable
  provisioner "remote-exec" {
    inline = [
      "echo 'Waiting for instance to be ready...'",
      "while ! systemctl is-active --quiet nodejs-tutorial; do sleep 10; done",
      "echo 'Node.js tutorial application is running!'"
    ]
    
    connection {
      type        = "ssh"
      user        = "ec2-user"
      private_key = tls_private_key.nodejs_tutorial_key.private_key_pem
      host        = aws_instance.nodejs_tutorial.public_ip
      timeout     = "5m"
    }
  }
  
  # Test application endpoint
  provisioner "local-exec" {
    command = <<-EOF
      echo "Testing Node.js application endpoint..."
      sleep 30  # Allow time for application startup
      
      # Test /hello endpoint
      if curl -f http://${aws_instance.nodejs_tutorial.public_ip}:3000/hello; then
        echo "✅ Application endpoint test passed!"
      else
        echo "❌ Application endpoint test failed!"
      fi
    EOF
  }
  
  depends_on = [aws_instance.nodejs_tutorial]
}

# ------------------------------------------------------------------------------
# RESOURCE OUTPUTS FOR INTEGRATION
# ------------------------------------------------------------------------------

# These outputs will be consumed by outputs.tf
# Educational Note: Outputs expose resource attributes for external use

# Instance public IP address
output "instance_public_ip" {
  description = "Public IP address of the Node.js tutorial server"
  value       = aws_instance.nodejs_tutorial.public_ip
  sensitive   = false
}

# Instance ID
output "instance_id" {
  description = "Unique identifier of the Node.js tutorial server instance"
  value       = aws_instance.nodejs_tutorial.id
  sensitive   = false
}

# Security Group ID
output "security_group_id" {
  description = "Security group ID controlling network access"
  value       = aws_security_group.nodejs_tutorial_sg.id
  sensitive   = false
}

# Deployment Region
output "deployment_region" {
  description = "AWS region where resources are deployed"
  value       = var.region
  sensitive   = false
}

# SSH Private Key (for educational purposes)
output "ssh_private_key" {
  description = "SSH private key for instance access (educational use only)"
  value       = tls_private_key.nodejs_tutorial_key.private_key_pem
  sensitive   = true
}

# Application URL
output "application_url" {
  description = "Complete URL for accessing the Node.js tutorial application"
  value       = "http://${aws_instance.nodejs_tutorial.public_ip}:3000/hello"
  sensitive   = false
}

# ------------------------------------------------------------------------------
# EDUCATIONAL DOCUMENTATION AND USAGE EXAMPLES
# ------------------------------------------------------------------------------

# Example commands for accessing the deployed infrastructure:
#
# 1. Test the application:
#    curl http://$(terraform output -raw instance_public_ip):3000/hello
#
# 2. SSH into the instance:
#    ssh -i nodejs-tutorial-key.pem ec2-user@$(terraform output -raw instance_public_ip)
#
# 3. Check application status:
#    systemctl status nodejs-tutorial
#
# 4. View application logs:
#    journalctl -u nodejs-tutorial -f
#
# 5. Destroy infrastructure:
#    terraform destroy -auto-approve

# Next steps for extending this infrastructure:
# - Add Application Load Balancer for high availability
# - Implement Auto Scaling Groups for elasticity
# - Add CloudWatch monitoring and alerting
# - Implement CI/CD pipeline integration
# - Add database resources for stateful applications
# - Configure custom domain and SSL certificates