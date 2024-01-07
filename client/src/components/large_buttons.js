

// Create a function to generate the button HTML
function generateButtonHTML() {
  // Define the styles for the button
  const buttonStyles = {
    width: '218px',
    height: '60px',
    left: '0',
    top: '0',
    position: 'absolute',
    background: 'white',
    borderRadius: '10px',
    border: '1.50px #98C26C solid',
  };

  // Define the text and its styles
  const buttonText = 'Try out the magic';
  const textStyles = {
    left: '29px',
    top: '16px',
    position: 'absolute',
    textAlign: 'center',
    color: '#728F4F',
    fontSize: '18px',
    fontFamily: 'Lexend Deca',
    fontWeight: '700',
    lineHeight: '27px',
    wordWrap: 'break-word',
  };

  // Create the button structure using Cheerio
  const $ = cheerio.load('<div></div>');

  // Set the styles for the button container
  $('div').css(buttonStyles);

  // Create and append the text element to the button container
  const textElement = $('<div></div>').css(textStyles).text(buttonText);
  $('div').append(textElement);

  return $.html(); // Return the HTML content
}

// Generate the button HTML content
const buttonHTML = generateButtonHTML();

// Write the button HTML to a file named 'button.html'
fs.writeFileSync('button.html', buttonHTML);

console.log('Button HTML has been created.');