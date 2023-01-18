data "terraform_remote_state" "release_state" {
  backend = "azurerm"

  config = {
    resource_group_name  = "chat-app"
    container_name       = "cluster"
    storage_account_name = "chatappazizmouheb"
    key                  = "cluster.json"
  }
}
resource "helm_release" "release" {
  name             = "release3"
  chart            = "../../charts/Backend"

  values = [
    file("../../charts/Backend/values.yaml")
  ]
}
