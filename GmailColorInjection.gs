/**
 * Gmail Color Injection Script
 * This script manages Gmail labels and filters to apply colors to emails
 */

/**
 * Creates or updates Gmail labels with colors for each sender
 */
function createColorLabelsForSenders() {
  try {
    const colorMappings = getAllSenderColors();
    
    Object.entries(colorMappings).forEach(([email, color]) => {
      const labelName = `Color: ${email}`;
      const labelColor = convertHexToGmailColor(color.hex);
      
      // Create or update label
      createOrUpdateLabel(labelName, labelColor);
      
      // Create filter for this sender
      createEmailFilter(email, labelName);
    });
    
    console.log('Color labels created/updated successfully');
  } catch (error) {
    console.error('Error creating color labels:', error);
    throw error;
  }
}

/**
 * Creates or updates a Gmail label with specified color
 */
function createOrUpdateLabel(labelName, gmailColor) {
  try {
    // Check if label already exists
    const existingLabels = Gmail.Users.Labels.list('me');
    const existingLabel = existingLabels.labels.find(label => label.name === labelName);
    
    if (existingLabel) {
      // Update existing label
      const updateRequest = {
        color: {
          backgroundColor: gmailColor.backgroundColor,
          textColor: gmailColor.textColor
        }
      };
      
      Gmail.Users.Labels.patch(updateRequest, 'me', existingLabel.id);
      console.log(`Updated label: ${labelName}`);
    } else {
      // Create new label
      const createRequest = {
        name: labelName,
        labelListVisibility: 'labelShow',
        messageListVisibility: 'show',
        color: {
          backgroundColor: gmailColor.backgroundColor,
          textColor: gmailColor.textColor
        }
      };
      
      Gmail.Users.Labels.create(createRequest, 'me');
      console.log(`Created label: ${labelName}`);
    }
  } catch (error) {
    console.error(`Error creating/updating label ${labelName}:`, error);
    throw error;
  }
}

/**
 * Creates a Gmail filter to automatically apply label to emails from specific sender
 */
function createEmailFilter(senderEmail, labelName) {
  try {
    // Get the label ID
    const labels = Gmail.Users.Labels.list('me');
    const label = labels.labels.find(l => l.name === labelName);
    
    if (!label) {
      console.error(`Label not found: ${labelName}`);
      return;
    }
    
    // Create filter criteria
    const filterRequest = {
      criteria: {
        from: senderEmail
      },
      action: {
        addLabelIds: [label.id]
      }
    };
    
    // Check if filter already exists
    const existingFilters = Gmail.Users.Settings.Filters.list('me');
    const filtersArray = existingFilters && existingFilters.filter ? existingFilters.filter : [];
    const existingFilter = filtersArray.find(filter => 
      filter.criteria.from === senderEmail && 
      filter.action.addLabelIds && 
      filter.action.addLabelIds.includes(label.id)
    );
    
    if (!existingFilter) {
      Gmail.Users.Settings.Filters.create(filterRequest, 'me');
      console.log(`Created filter for ${senderEmail}`);
    } else {
      console.log(`Filter already exists for ${senderEmail}`);
    }
  } catch (error) {
    console.error(`Error creating filter for ${senderEmail}:`, error);
    throw error;
  }
}

/**
 * Converts hex color to Gmail-compatible color
 */
function convertHexToGmailColor(hexColor) {
  // Gmail has predefined color options
  const gmailColors = {
    '#FF6B6B': { backgroundColor: '#ffad47', textColor: '#ffffff' }, // Red
    '#4ECDC4': { backgroundColor: '#16a766', textColor: '#ffffff' }, // Blue/Teal
    '#45B7D1': { backgroundColor: '#4a90e2', textColor: '#ffffff' }, // Blue
    '#F9CA24': { backgroundColor: '#f2c960', textColor: '#000000' }, // Yellow
    '#6C5CE7': { backgroundColor: '#9a9cff', textColor: '#ffffff' }, // Purple
    '#FFA726': { backgroundColor: '#ffad47', textColor: '#ffffff' }, // Orange
    '#F8BBD9': { backgroundColor: '#ff7bb3', textColor: '#000000' }, // Pink
    '#26D0CE': { backgroundColor: '#16a766', textColor: '#ffffff' }, // Teal
    '': { backgroundColor: '#cccccc', textColor: '#000000' } // Default
  };
  
  return gmailColors[hexColor] || gmailColors[''];
}

/**
 * Removes color labels and filters for a sender
 */
function removeColorForSender(senderEmail) {
  try {
    const labelName = `Color: ${senderEmail}`;
    
    // Get all labels
    const labels = Gmail.Users.Labels.list('me');
    const label = labels.labels.find(l => l.name === labelName);
    
    if (label) {
      // Remove all filters for this sender
      const filters = Gmail.Users.Settings.Filters.list('me');
      const filtersArray = filters && filters.filter ? filters.filter : [];
      const senderFilters = filtersArray.filter(filter => 
        filter.criteria.from === senderEmail
      );
      
      senderFilters.forEach(filter => {
        Gmail.Users.Settings.Filters.remove('me', filter.id);
        console.log(`Removed filter for ${senderEmail}`);
      });
      
      // Delete the label
      Gmail.Users.Labels.remove('me', label.id);
      console.log(`Removed label: ${labelName}`);
    }
  } catch (error) {
    console.error(`Error removing color for ${senderEmail}:`, error);
    throw error;
  }
}

/**
 * Applies colors to existing emails from a sender
 */
function applyColorToExistingEmails(senderEmail) {
  try {
    const labelName = `Color: ${senderEmail}`;
    
    // Get the label ID
    const labels = Gmail.Users.Labels.list('me');
    const label = labels.labels.find(l => l.name === labelName);
    
    if (!label) {
      console.error(`Label not found: ${labelName}`);
      return;
    }
    
    // Search for emails from this sender
    const query = `from:${senderEmail}`;
    const searchResults = Gmail.Users.Messages.list('me', { q: query, maxResults: 100 });
    
    if (searchResults.messages) {
      searchResults.messages.forEach(message => {
        // Add label to each message
        Gmail.Users.Messages.modify({
          addLabelIds: [label.id]
        }, 'me', message.id);
      });
      
      console.log(`Applied color to ${searchResults.messages.length} existing emails from ${senderEmail}`);
    }
  } catch (error) {
    console.error(`Error applying color to existing emails from ${senderEmail}:`, error);
    throw error;
  }
}

/**
 * Updates Gmail colors when sender color is changed
 */
function updateGmailColors() {
  try {
    // Remove all existing color labels and filters
    const labels = Gmail.Users.Labels.list('me');
    const colorLabels = labels.labels.filter(label => label.name.startsWith('Color: '));
    
    colorLabels.forEach(label => {
      Gmail.Users.Labels.remove('me', label.id);
    });
    
    // Remove all color-related filters
    const filters = Gmail.Users.Settings.Filters.list('me');
    const filtersArray = filters && filters.filter ? filters.filter : [];
    if (filtersArray.length > 0) {
      filtersArray.forEach(filter => {
        if (filter.action.addLabelIds) {
          const hasColorLabel = filter.action.addLabelIds.some(labelId => {
            const label = labels.labels.find(l => l.id === labelId);
            return label && label.name.startsWith('Color: ');
          });
          
          if (hasColorLabel) {
            Gmail.Users.Settings.Filters.remove('me', filter.id);
          }
        }
      });
    }
    
    // Recreate all labels and filters
    createColorLabelsForSenders();
    
    console.log('Gmail colors updated successfully');
  } catch (error) {
    console.error('Error updating Gmail colors:', error);
    throw error;
  }
}

/**
 * Sets up automatic color application when colors are changed
 */
function setupColorTriggers() {
  try {
    // This function is called when colors are set/changed
    const colorMappings = getAllSenderColors();
    
    Object.entries(colorMappings).forEach(([email, color]) => {
      // Apply color to existing emails
      applyColorToExistingEmails(email);
    });
    
    // Update Gmail labels and filters
    createColorLabelsForSenders();
    
  } catch (error) {
    console.error('Error setting up color triggers:', error);
    throw error;
  }
}

/**
 * Enhanced setSenderColor function that also applies to Gmail
 */
function setSenderColorWithGmail(e) {
  try {
    console.log('setSenderColorWithGmail called with parameters:', JSON.stringify(e.parameters));
    
    // First, set the color in storage (original functionality)
    const result = setSenderColor(e);
    
    // Then apply to Gmail
    const senderEmail = e.parameters.senderEmail;
    const colorHex = e.parameters.colorHex;
    
    // Validate parameters
    if (!senderEmail) {
      console.error('senderEmail is undefined or empty');
      return CardService.newActionResponseBuilder()
        .setNotification(CardService.newNotification()
          .setType(CardService.NotificationType.ERROR)
          .setText('Error: No sender email provided')
        )
        .build();
    }
    
    if (!colorHex) {
      console.error('colorHex is undefined or empty');
      return CardService.newActionResponseBuilder()
        .setNotification(CardService.newNotification()
          .setType(CardService.NotificationType.ERROR)
          .setText('Error: No color provided')
        )
        .build();
    }
    
    const labelName = `Color: ${senderEmail}`;
    console.log('Creating label:', labelName, 'with color:', colorHex);
    
    // Create/update label
    const gmailColor = convertHexToGmailColor(colorHex);
    createOrUpdateLabel(labelName, gmailColor);
    
    // Create filter
    createEmailFilter(senderEmail, labelName);
    
    // Apply to existing emails
    applyColorToExistingEmails(senderEmail);
    
    return result;
  } catch (error) {
    console.error('Error setting sender color with Gmail integration:', error);
    return CardService.newActionResponseBuilder()
      .setNotification(CardService.newNotification()
        .setType(CardService.NotificationType.ERROR)
        .setText('Error setting color')
      )
      .build();
  }
}

/**
 * Enhanced removeSenderColor function that also removes from Gmail
 */
function removeSenderColorWithGmail(e) {
  try {
    const senderEmail = e.parameters.senderEmail;
    
    // Remove from Gmail first
    removeColorForSender(senderEmail);
    
    // Then remove from storage
    const result = removeSenderColor(e);
    
    return result;
  } catch (error) {
    console.error('Error removing sender color from Gmail:', error);
    return CardService.newActionResponseBuilder()
      .setNotification(CardService.newNotification()
        .setType(CardService.NotificationType.ERROR)
        .setText('Error removing color')
      )
      .build();
  }
} 