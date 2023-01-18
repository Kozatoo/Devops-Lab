resource "helm_release" "mongodb" {
  name       = "mongodb"
  chart      = "../../charts/Databases"
  version = "1.0.0"
}