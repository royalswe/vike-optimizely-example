import { SecretClient } from '@azure/keyvault-secrets';
import { DefaultAzureCredential } from '@azure/identity';
/**
 * import setKeyVaultSecrets in server.ts to set secrets from Azure Key Vault
 *
 * Set secrets in env from Azure Key Vault
 * Vike will prevent app from building for production if secrets used in client-side.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function setKeyVaultSecrets() {
  const credential = new DefaultAzureCredential();

  const keyVaultName = process.env.KEY_VAULT_NAME;
  if (!keyVaultName) throw new Error('KEY_VAULT_NAME is empty');
  const url = 'https://' + keyVaultName + '.vault.azure.net';

  const client = new SecretClient(url, credential);

  // Secrets from Azure Key Vault
  const secrets = [{ name: 'OptimizelyApiKey', envVar: 'OPTIMIZELY_API_KEY' }];

  async function setSecrets() {
    for (const secretInfo of secrets) {
      const secret = await client.getSecret(secretInfo.name);
      process.env[secretInfo.envVar] = secret.value;
    }
  }

  await setSecrets().catch((error) => {
    console.error('Error setting secrets from key vault:', error);
  });
}
