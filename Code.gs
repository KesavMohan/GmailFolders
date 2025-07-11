/**
 * Gmail Folder Colors Add-on
 * Allows users to color-code emails from specific senders
 */

// Color palette available to users
const COLOR_PALETTE = [
  { name: 'Red', value: '#FF6B6B', hex: '#FF6B6B' },
  { name: 'Blue', value: '#4ECDC4', hex: '#4ECDC4' },
  { name: 'Green', value: '#45B7D1', hex: '#45B7D1' },
  { name: 'Yellow', value: '#F9CA24', hex: '#F9CA24' },
  { name: 'Purple', value: '#6C5CE7', hex: '#6C5CE7' },
  { name: 'Orange', value: '#FFA726', hex: '#FFA726' },
  { name: 'Pink', value: '#F8BBD9', hex: '#F8BBD9' },
  { name: 'Teal', value: '#26D0CE', hex: '#26D0CE' },
  { name: 'Default', value: '', hex: '' }
];

/**
 * Gets the contextual add-on card for Gmail
 */
function getContextualAddOn(e) {
  try {
    // Get the current message
    const accessToken = e.gmail.accessToken;
    const messageId = e.gmail.messageId;
    
    if (!messageId) {
      return createWelcomeCard();
    }
    
    // Get message details
    const message = Gmail.Users.Messages.get('me', messageId, {
      format: 'metadata',
      metadataHeaders: ['From', 'Subject']
    });
    
    if (!message || !message.payload || !message.payload.headers) {
      return createWelcomeCard();
    }
    
    // Extract sender email
    const fromHeader = message.payload.headers.find(h => h.name === 'From');
    const senderEmail = extractEmailFromHeader(fromHeader ? fromHeader.value : '');
    
    return createColorPickerCard(senderEmail, messageId);
    
  } catch (error) {
    console.error('Error in getContextualAddOn:', error);
    return createErrorCard('Error loading add-on');
  }
}

/**
 * Creates the main color picker card
 */
function createColorPickerCard(senderEmail, messageId) {
  const card = CardService.newCardBuilder()
    .setHeader(CardService.newCardHeader()
      .setTitle('Email Color Picker')
      .setSubtitle('Choose a color for this sender')
      .setImageUrl('https://www.gstatic.com/images/branding/product/1x/gmail_48dp.png')
    );
  
  // Show current sender
  const senderSection = CardService.newCardSection()
    .setHeader('Sender')
    .addWidget(CardService.newTextParagraph()
      .setText(`<b>${senderEmail}</b>`)
    );
  
  // Get current color for this sender
  const currentColor = getSenderColor(senderEmail);
  if (currentColor) {
    senderSection.addWidget(CardService.newTextParagraph()
      .setText(`Current color: <font color="${currentColor.hex}">${currentColor.name}</font>`)
    );
  }
  
  card.addSection(senderSection);
  
  // Color palette section
  const colorSection = CardService.newCardSection()
    .setHeader('Choose Color');
  
  COLOR_PALETTE.forEach(color => {
    const colorButton = CardService.newTextButton()
      .setText(color.name)
      .setOnClickAction(CardService.newAction()
        .setFunctionName('setSenderColorWithGmail')
        .setParameters({
          'senderEmail': senderEmail,
          'colorName': color.name,
          'colorValue': color.value,
          'colorHex': color.hex
        })
      );
    
    colorSection.addWidget(colorButton);
  });
  
  card.addSection(colorSection);
  
  // Add manage colors section
  const manageSection = CardService.newCardSection()
    .addWidget(CardService.newTextButton()
      .setText('Manage All Colors')
      .setOnClickAction(CardService.newAction()
        .setFunctionName('openColorSettings')
      )
    );
  
  card.addSection(manageSection);
  
  return card.build();
}

/**
 * Creates welcome card when no message is selected
 */
function createWelcomeCard() {
  const card = CardService.newCardBuilder()
    .setHeader(CardService.newCardHeader()
      .setTitle('Gmail Folder Colors')
      .setSubtitle('Color-code emails by sender')
      .setImageUrl('https://www.gstatic.com/images/branding/product/1x/gmail_48dp.png')
    );
  
  const section = CardService.newCardSection()
    .addWidget(CardService.newTextParagraph()
      .setText('Select an email to assign colors to specific senders. Once set, all emails from that sender will appear in your chosen color.')
    )
    .addWidget(CardService.newTextButton()
      .setText('Manage Colors')
      .setOnClickAction(CardService.newAction()
        .setFunctionName('openColorSettings')
      )
    );
  
  card.addSection(section);
  return card.build();
}

/**
 * Creates error card
 */
function createErrorCard(message) {
  const card = CardService.newCardBuilder()
    .setHeader(CardService.newCardHeader()
      .setTitle('Error')
      .setImageUrl('https://www.gstatic.com/images/branding/product/1x/gmail_48dp.png')
    );
  
  const section = CardService.newCardSection()
    .addWidget(CardService.newTextParagraph()
      .setText(message)
    );
  
  card.addSection(section);
  return card.build();
}

/**
 * Sets color for a sender
 */
function setSenderColor(e) {
  try {
    const senderEmail = e.parameters.senderEmail;
    const colorName = e.parameters.colorName;
    const colorValue = e.parameters.colorValue;
    const colorHex = e.parameters.colorHex;
    
    // Store the color mapping
    const colorData = {
      name: colorName,
      value: colorValue,
      hex: colorHex
    };
    
    saveSenderColor(senderEmail, colorData);
    
    // Show success notification
    const notification = CardService.newNotification()
      .setType(CardService.NotificationType.INFO)
      .setText(`Color "${colorName}" set for ${senderEmail}`);
    
    return CardService.newActionResponseBuilder()
      .setNotification(notification)
      .setNavigation(CardService.newNavigation()
        .updateCard(createColorPickerCard(senderEmail, ''))
      )
      .build();
    
  } catch (error) {
    console.error('Error setting sender color:', error);
    return CardService.newActionResponseBuilder()
      .setNotification(CardService.newNotification()
        .setType(CardService.NotificationType.ERROR)
        .setText('Error setting color')
      )
      .build();
  }
}

/**
 * Opens color settings management
 */
function openColorSettings() {
  const card = createColorSettingsCard();
  
  return CardService.newActionResponseBuilder()
    .setNavigation(CardService.newNavigation()
      .pushCard(card)
    )
    .build();
}

/**
 * Creates color settings management card
 */
function createColorSettingsCard() {
  const card = CardService.newCardBuilder()
    .setHeader(CardService.newCardHeader()
      .setTitle('Color Settings')
      .setSubtitle('Manage sender colors')
      .setImageUrl('https://www.gstatic.com/images/branding/product/1x/gmail_48dp.png')
    );
  
  const colorMappings = getAllSenderColors();
  
  if (Object.keys(colorMappings).length === 0) {
    const section = CardService.newCardSection()
      .addWidget(CardService.newTextParagraph()
        .setText('No colors have been set yet. Select an email to start assigning colors to senders.')
      );
    card.addSection(section);
  } else {
    const section = CardService.newCardSection()
      .setHeader('Current Color Assignments');
    
    Object.entries(colorMappings).forEach(([email, color]) => {
      section.addWidget(CardService.newKeyValue()
        .setTopLabel(email)
        .setContent(`<font color="${color.hex}">${color.name}</font>`)
        .setButton(CardService.newTextButton()
          .setText('Remove')
          .setOnClickAction(CardService.newAction()
            .setFunctionName('removeSenderColorWithGmail')
            .setParameters({ 'senderEmail': email })
          )
        )
      );
    });
    
    card.addSection(section);
  }
  
  return card.build();
}

/**
 * Removes color assignment for a sender
 */
function removeSenderColor(e) {
  try {
    const senderEmail = e.parameters.senderEmail;
    deleteSenderColor(senderEmail);
    
    const notification = CardService.newNotification()
      .setType(CardService.NotificationType.INFO)
      .setText(`Color removed for ${senderEmail}`);
    
    return CardService.newActionResponseBuilder()
      .setNotification(notification)
      .setNavigation(CardService.newNavigation()
        .updateCard(createColorSettingsCard())
      )
      .build();
    
  } catch (error) {
    console.error('Error removing sender color:', error);
    return CardService.newActionResponseBuilder()
      .setNotification(CardService.newNotification()
        .setType(CardService.NotificationType.ERROR)
        .setText('Error removing color')
      )
      .build();
  }
}



// Storage functions
function saveSenderColor(email, colorData) {
  const properties = PropertiesService.getUserProperties();
  properties.setProperty(`color_${email}`, JSON.stringify(colorData));
}

function getSenderColor(email) {
  const properties = PropertiesService.getUserProperties();
  const colorData = properties.getProperty(`color_${email}`);
  return colorData ? JSON.parse(colorData) : null;
}

function getAllSenderColors() {
  const properties = PropertiesService.getUserProperties();
  const allProperties = properties.getProperties();
  const colorMappings = {};
  
  Object.entries(allProperties).forEach(([key, value]) => {
    if (key.startsWith('color_')) {
      const email = key.replace('color_', '');
      colorMappings[email] = JSON.parse(value);
    }
  });
  
  return colorMappings;
}

function deleteSenderColor(email) {
  const properties = PropertiesService.getUserProperties();
  properties.deleteProperty(`color_${email}`);
}

// Utility functions
function extractEmailFromHeader(fromHeader) {
  if (!fromHeader) return '';
  
  // Extract email from "Name <email@domain.com>" format
  const emailMatch = fromHeader.match(/<([^>]+)>/);
  if (emailMatch) {
    return emailMatch[1];
  }
  
  // If no angle brackets, assume the whole thing is an email
  return fromHeader.trim();
} 