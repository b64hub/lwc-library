# LWC Library

A Lightning Web Components library for Salesforce development using the scratch org model.

## Prerequisites

- [Salesforce CLI (sf)](https://developer.salesforce.com/tools/salesforcecli)
- [sfp CLI](https://docs.flxbl.io/sfp)
- Node.js and npm
- Access to a Salesforce Dev Hub org

## Quick Start

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Authenticate to Dev Hub**

   Run this once to connect to your Dev Hub (typically your Production org):

   ```bash
   sf org login device --setalias devhub
   ```

3. **Create a Scratch Org**

   Choose one of the following options:

   **Option A: Fetch from Pool (Recommended)**

   ```bash
   sfp pool fetch -t dev -a <your-alias>
   ```

   **Option B: Create New Scratch Org**

   ```bash
   sf org create --definitionfile config/project-scratch-def.json --setalias <your-alias> --targetdevhubusername devhub
   sfp dependency install -o <your-alias> -v devhub
   sf deploy metadata -o <your-alias>
   ```

## Development

### Available Scripts

- `npm run lint` - Run ESLint on LWC components
- `npm run test` - Run unit tests
- `npm run test:unit:watch` - Run tests in watch mode
- `npm run test:unit:coverage` - Generate test coverage report
- `npm run prettier` - Format code
- `npm run compile` - Compile TypeScript

### Project Structure

```
src/
  lwc/          - Lightning Web Components
config/         - Scratch org configuration
scripts/        - Helper scripts
```

### VS Code Tasks

Use these tasks from the Command Palette (Ctrl+Shift+P):

- **Fetch new Scratch Org 🚀** - Create a new scratch org
- **Pull your changes from the Scratch Org ⬅️** - Sync changes from scratch org

## License

MIT License - see [LICENSE](LICENSE) file for details.
