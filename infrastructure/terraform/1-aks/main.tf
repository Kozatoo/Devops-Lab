data "azurerm_resource_group" "devops-project" {
  name     = "chat-app"
}

resource "azurerm_kubernetes_cluster" "chat-cluster" {
  name                = var.aks_cluster_name
  location            = data.azurerm_resource_group.devops-project.location
  resource_group_name = data.azurerm_resource_group.devops-project.name
  dns_prefix          = "chat-cluster"
  sku_tier            = "Free"
  http_application_routing_enabled = true

  default_node_pool {
    name                = "default"
    enable_auto_scaling = true
    min_count           = 1
    max_count           = 2
    vm_size             = "Standard_B2ms"
  }

  identity {
    type = "SystemAssigned"
  }

  network_profile {
    network_plugin = "kubenet"
    network_policy = "calico"
  }

  provisioner "local-exec" {
    command = "echo ${self.kube_config_raw} >> ~/.kube/config"
  }

  tags = {
    Environment = "Development"
  }
}

