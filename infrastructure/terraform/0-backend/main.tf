resource "azurerm_resource_group" "devops-chat-app" {
  name     = "chat-app"
  location = "West Europe"
}

resource "azurerm_storage_account" "devops-storage-account" {
  name                     = "chatappazizmouheb"
  resource_group_name      = azurerm_resource_group.devops-chat-app.name
  location                 = azurerm_resource_group.devops-chat-app.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

resource "azurerm_storage_container" "devops-storage-container" {
  name                  = "cluster"
  storage_account_name  = azurerm_storage_account.devops-storage-account.name
  container_access_type = "private"
}

resource "azurerm_storage_blob" "devops-storage-blob" {
  name                   = "cluster.json"
  storage_account_name   = azurerm_storage_account.devops-storage-account.name
  storage_container_name = azurerm_storage_container.devops-storage-container.name
  type                   = "Block"
}