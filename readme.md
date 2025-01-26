## Initial Deploy

Create secrets.yaml, where each of the values is encoded in base64 (e.g., via `echo -n "mysecret" | base64`).
The following values are required:

- `TARGET_IP`: IP of the probe
- `TARGET_USERNAME`: Username of a probe user
- `TARGET_PASSWORD`: Password of the probe user with name `TARGET_USERNAME`
- `CONTROLLER_URL`: URL of the unifi controller
- `USERNAME`: Username of the unifi controller
- `PASSWORD`: Password of the unifi user with name `USERNAME`
- `SITE_NAME`: Site which contains the switch under test
- `SWITCH_MAC`: MAC of the switch under test

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: network-secrets
  namespace: network
type: Opaque
data:
  TARGET_IP:
  TARGET_USERNAME:
  TARGET_PASSWORD:
  CONTROLLER_URL:
  USERNAME:
  PASSWORD:
  SITE_NAME:
  SWITCH_MAC:
```

```bash
kubectl apply -f secrets.yaml
kubectl apply --validate=true -f deployment.yaml
```

## Update to new image

```bash
kubectl rollout restart deployment network -n network
```

## Delete

```bash
kubectl delete -f deployment.yaml
```
