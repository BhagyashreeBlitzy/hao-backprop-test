# ==============================================================================
# TERRAFORM OUTPUTS CONFIGURATION
# ==============================================================================
# This file defines Terraform output values for the Node.js tutorial application's
# infrastructure. It exposes key information about provisioned resources to support
# educational visibility and integration with documentation or deployment scripts.
#
# DESIGN PRINCIPLES:
# - Avoids circular dependencies with main.tf and variables.tf
# - Uses locals and data sources instead of direct resource references
# - Provides clear educational documentation for each output
# - Supports post-deployment validation and automation scripts
# ==============================================================================

# ------------------------------------------------------------------------------
# LOCAL VALUES FOR OUTPUT SOURCES
# ------------------------------------------------------------------------------
# These locals are expected to be set via data sources, module inputs, or
# direct assignment within the Terraform configuration. This approach ensures
# this outputs file remains self-contained and doesn't create circular dependencies.

locals {
  # Public IP address of the provisioned Node.js server instance
  # Expected to be set via data source or module input variable
  public_ip = var.instance_public_ip != null ? var.instance_public_ip : ""
  
  # Unique identifier of the provisioned compute instance
  # Expected to be set via data source or module input variable
  instance_id = var.instance_id != null ? var.instance_id : ""
  
  # Security group ID used for network access control
  # Expected to be set via data source or module input variable
  security_group_id = var.security_group_id != null ? var.security_group_id : ""
  
  # Cloud region where resources are provisioned
  # Expected to be set via data source or module input variable
  region = var.deployment_region != null ? var.deployment_region : ""
}

# ------------------------------------------------------------------------------
# PRIMARY INFRASTRUCTURE OUTPUTS
# ------------------------------------------------------------------------------

# Public IP Address Output
# Exposes the public IPv4 address of the Node.js tutorial server for HTTP access
output "public_ip" {
  description = <<-EOT
    The public IPv4 address assigned to the Node.js tutorial server instance.
    Use this IP address to access the application via HTTP at http://<public_ip>:3000/hello
    Also suitable for SSH access and troubleshooting during development.
    
    Educational Note: This demonstrates how cloud instances receive public IP addresses
    for internet connectivity and how infrastructure outputs enable integration with
    external tools and documentation.
  EOT
  
  value = local.public_ip != null ? local.public_ip : ""
  
  # Mark as non-sensitive for educational visibility
  # In production environments, consider security implications
  sensitive = false
}

# Instance Identifier Output
# Exposes the unique instance ID for troubleshooting and automation
output "instance_id" {
  description = <<-EOT
    The unique identifier of the provisioned Node.js tutorial server instance.
    This ID is useful for:
    - Infrastructure troubleshooting and debugging
    - Integration with monitoring and logging systems
    - Automation scripts and CI/CD pipeline references
    - Cloud provider console identification
    
    Educational Note: Instance IDs are immutable identifiers assigned by cloud
    providers to uniquely identify compute resources across the platform.
  EOT
  
  value = local.instance_id != null ? local.instance_id : ""
  
  sensitive = false
}

# Security Group Configuration Output
# Exposes the security group ID for network security reference
output "security_group_id" {
  description = <<-EOT
    The security group ID controlling network access to the Node.js tutorial server.
    This identifier references the network security rules that:
    - Allow HTTP traffic on port 3000 for application access
    - Control SSH access for server management
    - Define ingress and egress traffic patterns
    
    Educational Note: Security groups act as virtual firewalls that control
    network traffic at the instance level, demonstrating cloud security concepts.
  EOT
  
  value = local.security_group_id != null ? local.security_group_id : ""
  
  sensitive = false
}

# Deployment Region Output
# Exposes the cloud region for user reference and automation
output "region" {
  description = <<-EOT
    The cloud region where the Node.js tutorial infrastructure is deployed.
    This information is valuable for:
    - Understanding data residency and latency characteristics
    - Configuring region-specific integrations and services
    - Multi-region deployment coordination
    - Cost allocation and resource management
    
    Educational Note: Cloud regions represent geographically distributed
    data centers that affect performance, compliance, and availability.
  EOT
  
  value = local.region != null ? local.region : ""
  
  sensitive = false
}

# ------------------------------------------------------------------------------
# EDUCATIONAL SUMMARY OUTPUT
# ------------------------------------------------------------------------------

# Combined Infrastructure Summary
# Provides a comprehensive overview of all provisioned resources
output "infrastructure_summary" {
  description = <<-EOT
    A comprehensive summary of the Node.js tutorial application infrastructure.
    This output combines all key infrastructure details in a single, easy-to-read
    format suitable for documentation, scripts, and educational reference.
    
    Use this output to quickly understand the complete infrastructure state
    without querying individual outputs separately.
  EOT
  
  value = {
    application = {
      name        = "Node.js Tutorial Application"
      description = "Educational Express.js server with /hello endpoint"
      version     = "1.0.0"
    }
    
    infrastructure = {
      public_ip          = local.public_ip != null ? local.public_ip : "Not Available"
      instance_id        = local.instance_id != null ? local.instance_id : "Not Available"
      security_group_id  = local.security_group_id != null ? local.security_group_id : "Not Available"
      region            = local.region != null ? local.region : "Not Available"
    }
    
    access_information = {
      application_url = local.public_ip != null ? "http://${local.public_ip}:3000/hello" : "URL not available - check public_ip output"
      health_check   = local.public_ip != null ? "http://${local.public_ip}:3000/health" : "Health check not available"
      protocol       = "HTTP/1.1"
      port          = 3000
    }
    
    educational_notes = {
      architecture = "Single-tier Node.js application with Express.js framework"
      deployment   = "Cloud-based infrastructure-as-code deployment"
      scalability  = "Stateless design enables horizontal scaling"
      security     = "Network security via security groups and access controls"
    }
  }
  
  sensitive = false
}

# ------------------------------------------------------------------------------
# DEPLOYMENT VALIDATION OUTPUTS
# ------------------------------------------------------------------------------

# Application URL Output
# Provides the complete URL for immediate application testing
output "application_url" {
  description = <<-EOT
    The complete URL for accessing the Node.js tutorial application.
    Visit this URL in your browser to see the "Hello world" response.
    
    This output demonstrates how infrastructure outputs can be composed
    to provide user-friendly access information.
  EOT
  
  value = local.public_ip != null ? "http://${local.public_ip}:3000/hello" : "Application URL not available - check infrastructure deployment"
  
  sensitive = false
}

# Health Check URL Output  
# Provides URL for application health monitoring
output "health_check_url" {
  description = <<-EOT
    The URL for checking application health and availability.
    Use this endpoint to verify the Node.js server is running correctly.
    
    Health checks are essential for monitoring and automated deployment
    validation in production environments.
  EOT
  
  value = local.public_ip != null ? "http://${local.public_ip}:3000/health" : "Health check URL not available"
  
  sensitive = false
}

# ------------------------------------------------------------------------------
# INTEGRATION HELPER OUTPUTS
# ------------------------------------------------------------------------------

# SSH Connection String Output
# Provides ready-to-use SSH command for server access
output "ssh_connection" {
  description = <<-EOT
    SSH connection command for accessing the Node.js tutorial server.
    Replace <your-key-file> with the path to your SSH private key.
    
    Educational Note: SSH access enables server administration, log review,
    and troubleshooting of the Node.js application in cloud environments.
  EOT
  
  value = local.public_ip != null ? "ssh -i <your-key-file> ec2-user@${local.public_ip}" : "SSH connection not available - check public IP"
  
  sensitive = false
}

# cURL Test Command Output
# Provides ready-to-use command for API testing
output "curl_test_command" {
  description = <<-EOT
    cURL command for testing the Node.js tutorial application endpoint.
    Execute this command to verify the /hello endpoint responds correctly.
    
    This demonstrates how infrastructure outputs can provide immediate
    testing capabilities for deployed applications.
  EOT
  
  value = local.public_ip != null ? "curl -X GET http://${local.public_ip}:3000/hello" : "cURL test not available - check deployment status"
  
  sensitive = false
}

# ------------------------------------------------------------------------------
# TROUBLESHOOTING INFORMATION
# ------------------------------------------------------------------------------

# Deployment Status Output
# Provides status information for troubleshooting
output "deployment_status" {
  description = <<-EOT
    Deployment status information for troubleshooting and validation.
    This output helps identify which infrastructure components are properly
    configured and which may need attention.
  EOT
  
  value = {
    public_ip_configured     = local.public_ip != null && local.public_ip != ""
    instance_id_configured   = local.instance_id != null && local.instance_id != ""
    security_group_configured = local.security_group_id != null && local.security_group_id != ""
    region_configured        = local.region != null && local.region != ""
    
    ready_for_access = (
      local.public_ip != null && local.public_ip != "" &&
      local.instance_id != null && local.instance_id != ""
    )
    
    next_steps = local.public_ip != null && local.public_ip != "" ? [
      "1. Test application: curl http://${local.public_ip}:3000/hello",
      "2. Check health: curl http://${local.public_ip}:3000/health", 
      "3. Access via browser: http://${local.public_ip}:3000/hello"
    ] : [
      "1. Verify infrastructure deployment completed successfully",
      "2. Check that public IP address was assigned to instance",
      "3. Ensure security groups allow HTTP traffic on port 3000"
    ]
  }
  
  sensitive = false
}

# ------------------------------------------------------------------------------
# EDUCATIONAL METADATA
# ------------------------------------------------------------------------------

# Infrastructure Learning Points Output
# Provides educational context about the infrastructure
output "learning_points" {
  description = <<-EOT
    Key learning points demonstrated by this infrastructure deployment.
    This output serves as educational reference for understanding
    infrastructure-as-code concepts and cloud deployment patterns.
  EOT
  
  value = {
    terraform_concepts = [
      "Output values expose infrastructure information",
      "Locals prevent circular dependencies between files",
      "Descriptions provide documentation and context",
      "Sensitive flags control information visibility"
    ]
    
    infrastructure_concepts = [
      "Public IP addresses enable internet connectivity",
      "Instance IDs provide unique resource identification", 
      "Security groups control network access patterns",
      "Cloud regions affect performance and compliance"
    ]
    
    nodejs_concepts = [
      "Stateless applications scale horizontally",
      "HTTP servers bind to specific ports for network access",
      "Health checks enable monitoring and automation",
      "Express.js provides web application framework capabilities"
    ]
    
    best_practices = [
      "Use infrastructure outputs for integration and automation",
      "Document infrastructure components for team collaboration",
      "Implement health checks for production readiness",
      "Follow security best practices for network access control"
    ]
  }
  
  sensitive = false
}