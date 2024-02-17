# BC Responsive

If you have any questions or suggestions, please go to [issues](../../issues)

If you need to correct the text or add translations, please refer to [i18n directory](./src/i18n)

## Build

This package requires `workspace:bc-utilities` to be built. You need to have it in your pnpm workspace.

```bash
md my_workspace && cd my_workspace
pnpm init -w
md packages
echo 'packages:' '  - packages/*' > pnpm-workspace.yaml
cd packages
git clone <this_repo>
git clone https://gitlab.com/dynilath/bc-utilities.git
cd ..
pnpm install
```