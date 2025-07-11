# Gmail Folder Colors Add-on

A Gmail add-on that allows users to color-code emails from specific senders. This add-on can be submitted to the Google Workspace Marketplace.

## Features

- **Color-code emails by sender**: Select any email and assign a color to that sender
- **Standard color palette**: Choose from 8 predefined colors (Red, Blue, Green, Yellow, Purple, Orange, Pink, Teal)
- **Automatic application**: Colors are automatically applied to all emails from the assigned sender
- **Gmail integration**: Uses Gmail labels and filters to apply colors directly in Gmail
- **Easy management**: View and manage all color assignments from the add-on interface

## How It Works

1. **Select an email** from any sender in your Gmail inbox
2. **Open the add-on** from the Gmail sidebar
3. **Choose a color** from the predefined palette
4. **Automatic application**: The add-on creates Gmail labels and filters to color all emails from that sender
5. **Manage colors**: View and remove color assignments through the settings interface

## Installation & Setup

### Prerequisites

- Google Apps Script account
- Gmail account with appropriate permissions
- Google Cloud Console project (for marketplace submission)

### Setup Instructions

1. **Create a new Google Apps Script project**
   - Go to [script.google.com](https://script.google.com)
   - Click "New Project"
   - Give your project a name (e.g., "Gmail Folder Colors")

2. **Add the code files**
   - Replace the default `Code.gs` with the provided `Code.gs` file
   - Create a new script file called `GmailColorInjection.gs` and add the provided code
   - Replace the `appsscript.json` file with the provided manifest

3. **Enable Gmail API**
   - In the Apps Script editor, go to "Services" (left sidebar)
   - Click "Add a service"
   - Select "Gmail API" and click "Add"

4. **Set up OAuth permissions**
   - The manifest includes all necessary OAuth scopes
   - Users will be prompted to authorize the add-on when first used

5. **Test the add-on**
   - Click "Deploy" > "Test deployments"
   - Select "Install add-on"
   - Test in your Gmail account

## Deployment to Google Workspace Marketplace

### Step 1: Prepare for Marketplace Submission

1. **Create a Google Cloud Console project**
   - Go to [console.cloud.google.com](https://console.cloud.google.com)
   - Create a new project or select an existing one
   - Enable the Gmail API for your project

2. **Link your Apps Script project**
   - In Apps Script, go to "Project Settings"
   - Under "Google Cloud Platform (GCP) Project", enter your GCP project number

3. **Set up OAuth consent screen**
   - In Google Cloud Console, go to "APIs & Services" > "OAuth consent screen"
   - Configure your app information, including:
     - Application name: "Gmail Folder Colors"
     - User support email
     - Developer contact information
     - Privacy policy URL
     - Terms of service URL

### Step 2: Create Marketplace Listing

1. **Access the Google Workspace Marketplace**
   - Go to [console.cloud.google.com](https://console.cloud.google.com)
   - Navigate to "Google Workspace Marketplace SDK"

2. **Create app configuration**
   - Click "App Configuration"
   - Fill in all required fields:
     - App name: "Gmail Folder Colors"
     - Description: "Color-code emails by sender to organize your inbox"
     - Category: "Productivity"
     - Language: English

3. **Upload assets**
   - App icon (128x128px)
   - Screenshots showing the add-on in action
   - Promotional images

4. **Set up store listing**
   - Detailed description
   - Key features
   - Installation instructions
   - Support contact information

### Step 3: Submit for Review

1. **Complete the submission form**
   - Provide all required information
   - Include test accounts for Google to review
   - Explain the add-on's functionality

2. **Wait for approval**
   - Google will review your add-on
   - This process typically takes 1-2 weeks
   - You may receive feedback requiring changes

## Usage Instructions

### For End Users

1. **Install the add-on**
   - Install from Google Workspace Marketplace
   - Authorize the required permissions

2. **Assign colors to senders**
   - Open any email in Gmail
   - Click the "Gmail Folder Colors" icon in the sidebar
   - Select a color from the palette
   - The color will be applied to all emails from that sender

3. **Manage color assignments**
   - Click "Manage Colors" in the add-on interface
   - View all current color assignments
   - Remove colors as needed

### Color Palette

The add-on includes these predefined colors:
- **Red** (#FF6B6B)
- **Blue** (#45B7D1)
- **Green** (#4ECDC4)
- **Yellow** (#F9CA24)
- **Purple** (#6C5CE7)
- **Orange** (#FFA726)
- **Pink** (#F8BBD9)
- **Teal** (#26D0CE)
- **Default** (remove color)

## Technical Details

### Architecture

- **Google Apps Script**: Backend logic and Gmail API integration
- **Gmail API**: Reading emails and managing labels/filters
- **CardService**: User interface for the add-on
- **PropertiesService**: User preference storage

### Files Structure

- `appsscript.json`: Manifest file with add-on configuration
- `Code.gs`: Main add-on logic and user interface
- `GmailColorInjection.gs`: Gmail integration and color application
- `README.md`: This documentation file

### Security & Privacy

- Uses minimal required permissions
- Only accesses Gmail data necessary for functionality
- Stores color preferences locally in user's Google account
- No data is sent to external servers

## Troubleshooting

### Common Issues

1. **Add-on not appearing**
   - Check that Gmail API is enabled
   - Verify OAuth scopes in manifest
   - Ensure proper deployment

2. **Colors not applying**
   - Check Gmail labels are created
   - Verify filters are set up correctly
   - Ensure sufficient permissions

3. **Permission errors**
   - Re-authorize the add-on
   - Check OAuth consent screen configuration

### Support

For technical support or feature requests:
- Email: [your-support-email]
- Documentation: [link to documentation]
- Bug reports: [link to issue tracker]

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Changelog

### Version 1.0.0
- Initial release
- Basic color assignment functionality
- Gmail integration
- Color management interface 