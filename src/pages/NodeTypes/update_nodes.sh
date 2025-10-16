#!/bin/bash

# List of files to update
files=(
  "PhoneNode.jsx"
  "CalendarNode.jsx"
  "ChatbotNode.jsx"
  "ApplicationPageNode.jsx"
  "ChatbotOptInNode.jsx"
  "ContentPageNode.jsx"
  "CustomPageNode.jsx"
  "DownsellPageNode.jsx"
  "PhoneOrderNode.jsx"
  "PopUpNode.jsx"
  "SurveyNode.jsx"
  "ThankYouNode.jsx"
  "UpsellPageNode.jsx"
  "WebinarLiveNode.jsx"
  "WebinarRegisterNode.jsx"
  "WebinarReplayNode.jsx"
  "WebinarSalesNode.jsx"
)

for file in "${files[@]}"; do
  echo "Processing $file..."
  
  # Create a backup
  cp "$file" "${file}.bak"
  
  # Make the changes using perl for better regex support
  perl -i -pe '
    # Change useRef import to useState
    s/import \{ useCallback, useRef \}/import { useState }/;
    s/import \{ useRef \}/import { useState }/;
    
    # Replace closeModalRef and modalOpenRef declarations with useState
    if (/const closeModalRef = useRef\(\);/ || /const modalOpenRef = useRef\(\);/) {
      $_ = "  const [isModalOpen, setIsModalOpen] = useState(false);\n\n";
      $skip_next = 1;
    } elsif ($skip_next) {
      $skip_next = 0;
      $_ = "";
    }
    
    # Replace modalOpenRef.current.click() with setIsModalOpen(true)
    s/modalOpenRef\.current\.click\(\)/setIsModalOpen(true)/;
    
    # Remove the hidden div trigger
    if (/ref={modalOpenRef}/) {
      $in_trigger = 1;
      $_ = "";
    }
    if ($in_trigger && /^\s*<\/div>\s*$/) {
      $in_trigger = 0;
      $_ = "";
    }
    if ($in_trigger) {
      $_ = "";
    }
    
    # Update NodeModal props
    s/modalId={`#m\$\{id\.replaceAll\("-", ""\)\}`}/open={isModalOpen}\n            onOpenChange={setIsModalOpen}/;
    s/closeModalRef={closeModalRef}//;
    s/\s+data=/data=/;
  ' "$file"
  
done

echo "All files updated!"
