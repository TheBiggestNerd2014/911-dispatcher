// Game State
let score = 0;
let callsCompleted = 0;
let correctDispatches = 0;
let totalDispatches = 0;
let currentCall = null;
let selectedUnits = [];
let gameActive = false;
let typingInProgress = false;

// Name Generation Data (Multi-cultural)
const firstNames = [
    // English/Western
    "Sarah", "John", "Emily", "Michael", "Jessica", "David", "Amanda", "Robert", "Linda", "James",
    "Patricia", "William", "Jennifer", "Richard", "Elizabeth", "Thomas", "Maria", "Daniel", "Nancy", "Matthew",
    // Hispanic/Latino
    "Carlos", "Maria", "Jose", "Carmen", "Miguel", "Ana", "Diego", "Isabella", "Antonio", "Sofia",
    "Luis", "Rosa", "Juan", "Elena", "Fernando", "Lucia", "Pedro", "Gabriela", "Ramon", "Valentina",
    // Asian
    "Wei", "Li", "Yuki", "Hiroshi", "Mei", "Chen", "Sakura", "Kenji", "Priya", "Raj",
    "Min", "Soo", "Haruto", "Akiko", "Arjun", "Aisha", "Jian", "Yua", "Ananya", "Ravi",
    // Middle Eastern
    "Ahmed", "Fatima", "Omar", "Layla", "Hassan", "Zainab", "Ali", "Noor", "Ibrahim", "Amira",
    "Khalid", "Yasmin", "Tariq", "Maryam", "Karim", "Amal", "Mustafa", "Leila", "Rashid", "Hala",
    // African
    "Kwame", "Amara", "Kofi", "Nia", "Jabari", "Zuri", "Malik", "Imani", "Idris", "Aaliyah",
    "Chidi", "Nala", "Sekou", "Kya", "Jamal", "Zola", "Omar", "Sanaa", "Tariq", "Ayanna",
    // European (various)
    "Ivan", "Olga", "Klaus", "Ingrid", "Pierre", "Marie", "Marco", "Giulia", "Lars", "Astrid"
];

const lastNames = [
    // English/Western
    "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez",
    "Wilson", "Anderson", "Taylor", "Thomas", "Moore", "Jackson", "Martin", "Lee", "Thompson", "White",
    // Hispanic/Latino
    "Hernandez", "Lopez", "Gonzalez", "Perez", "Sanchez", "Ramirez", "Torres", "Rivera", "Gomez", "Diaz",
    "Cruz", "Morales", "Reyes", "Gutierrez", "Ortiz", "Mendoza", "Silva", "Castro", "Vargas", "Ruiz",
    // Asian
    "Chen", "Wang", "Zhang", "Liu", "Yang", "Huang", "Zhao", "Wu", "Zhou", "Xu",
    "Tanaka", "Suzuki", "Watanabe", "Yamamoto", "Sato", "Kobayashi", "Ito", "Patel", "Singh", "Kumar",
    // Middle Eastern
    "Hassan", "Al-Farsi", "Rahman", "Khalil", "Mansoor", "Qureshi", "Shahid", "Bakr", "Malik", "Aziz",
    "Al-Rashid", "Hakim", "Nasser", "Al-Din", "Farouk", "Bashar", "Al-Mansur", "Kareem", "Tariq", "Mustafa",
    // African
    "Okafor", "Adeyemi", "Mensah", "Ndlovu", "Diallo", "Kamara", "Nkrumah", "Mwangi", "Osei", "Banda",
    "Okeke", "Balogun", "Traore", "Dube", "Keita", "Nyerere", "Mbeki", "Sankara", "Kagame", "Sisulu",
    // European (various)
    "Mueller", "Schmidt", "Novak", "Kowalski", "Rossi", "Russo", "Dubois", "Bernard", "Nielsen", "Johansson"
];

const streetNames = [
    // Nature-themed
    "Oak", "Maple", "Pine", "Cedar", "Elm", "Birch", "Willow", "Spruce", "Ash", "Cherry",
    "Rose", "Lily", "Violet", "Daisy", "Magnolia", "Jasmine", "Orchid", "Tulip", "Ivy", "Holly",
    // Ordinal/Numeric
    "First", "Second", "Third", "Fourth", "Fifth", "Sixth", "Seventh", "Eighth", "Ninth", "Tenth",
    // Geographic
    "Park", "Hill", "Valley", "Ridge", "Lake", "River", "Mountain", "Forest", "Meadow", "Highland",
    "Sunset", "Sunrise", "Ocean", "Harbor", "Bay", "Beach", "Canyon", "Vista", "Summit", "Grove",
    // Historical/Famous
    "Washington", "Lincoln", "Jefferson", "Madison", "Adams", "Franklin", "Kennedy", "Roosevelt", "Wilson", "Grant",
    // Descriptive
    "Main", "Center", "Church", "School", "Market", "Mill", "Spring", "Pleasant", "Broad", "Green"
];

const streetSuffixes = [
    "Street", "Avenue", "Road", "Drive", "Lane", "Boulevard", "Court", "Place", "Way", "Circle",
    "Parkway", "Terrace", "Trail", "Path", "Commons", "Plaza", "Square", "Row", "Alley", "Highway"
];

const apartmentTypes = ["Apartment", "Unit", "Suite", "#"];

// Random generation functions
function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function generateRandomName() {
    return `${getRandomElement(firstNames)} ${getRandomElement(lastNames)}`;
}

function generateRandomAddress() {
    const houseNumber = Math.floor(Math.random() * 9999) + 1;
    const streetName = getRandomElement(streetNames);
    const suffix = getRandomElement(streetSuffixes);
    
    // 30% chance of apartment/unit number
    if (Math.random() < 0.3) {
        const aptType = getRandomElement(apartmentTypes);
        const aptNum = Math.floor(Math.random() * 99) + 1;
        const aptLetter = String.fromCharCode(65 + Math.floor(Math.random() * 4)); // A-D
        return `${houseNumber} ${streetName} ${suffix}, ${aptType} ${aptNum}${aptLetter}`;
    }
    
    return `${houseNumber} ${streetName} ${suffix}`;
}

// Emergency Scenario Templates (will be populated with random names/locations)
const emergencyTemplates = [
    // MEDICAL EMERGENCIES
    {
        type: "Medical Emergency",
        dialogue: "Hello?! Please help! My {relative} just collapsed and isn't breathing! I don't know what to do!",
        correctUnits: ["ambulance"],
        responses: {
            name: "My name is {caller}!",
            location: "We're at {location}!",
            emergency: "They collapsed! Not breathing! I think it's their heart!",
            reassure: "Okay... okay... please hurry!"
        }
    },
    {
        type: "Medical Emergency",
        dialogue: "My {relative} is having chest pains and {pronoun} left arm is numb! {Pronoun} sweating a lot! I think it's a heart attack!",
        correctUnits: ["ambulance"],
        responses: {
            name: "{caller}. Please hurry!",
            location: "{location}. We're in the living room.",
            emergency: "Chest pains! Left arm numb! I think it's a heart attack!",
            reassure: "Okay, I'll try to keep {pronoun} calm. Please hurry!"
        }
    },
    {
        type: "Medical Emergency",
        dialogue: "Help! Someone fell from a ladder! They're conscious but I think their leg is broken! It looks really bad!",
        correctUnits: ["ambulance"],
        responses: {
            name: "I'm {caller}!",
            location: "{location}! In the backyard!",
            emergency: "Fell from a ladder! Leg injury, possible fracture!",
            reassure: "Okay! I'll make sure they don't move!"
        }
    },
    {
        type: "Overdose",
        dialogue: "My {relative} took too many pills and won't wake up! They're breathing but barely responsive!",
        correctUnits: ["ambulance"],
        responses: {
            name: "{caller}! Please help them!",
            location: "{location}! We're in the bedroom!",
            emergency: "Overdose! Found empty pill bottle! Barely breathing!",
            reassure: "Okay, I'm staying with them! Please hurry!"
        }
    },
    {
        type: "Severe Bleeding",
        dialogue: "I was cooking and cut my hand really bad! There's so much blood! I'm getting dizzy!",
        correctUnits: ["ambulance"],
        responses: {
            name: "{caller}... I'm feeling really dizzy...",
            location: "{location}... in the kitchen...",
            emergency: "Deep cut! Heavy bleeding! Getting lightheaded!",
            reassure: "Okay... I'm sitting down and pressing on it... please hurry..."
        }
    },
    {
        type: "Medical Emergency",
        dialogue: "My elderly neighbor fell and can't get up! I think she broke her hip! She's in a lot of pain!",
        correctUnits: ["ambulance"],
        responses: {
            name: "My name is {caller}, I'm her neighbor.",
            location: "She's at {location}. The door is unlocked.",
            emergency: "Elderly person fell! Possible hip fracture! Severe pain!",
            reassure: "Thank you! I'll stay with her until help arrives!"
        }
    },
    {
        type: "Medical Emergency",
        dialogue: "My child has a high fever and is having a seizure! This has never happened before! I don't know what to do!",
        correctUnits: ["ambulance"],
        responses: {
            name: "{caller}!",
            location: "{location}!",
            emergency: "Child seizure! High fever! First time this has happened!",
            reassure: "Okay, I'm making sure they can't hurt themselves. Please hurry!"
        }
    },
    // FIRE EMERGENCIES
    {
        type: "House Fire",
        dialogue: "There's smoke everywhere! My kitchen is on fire and it's spreading fast! We're getting out now!",
        correctUnits: ["fire", "multiple"],
        responses: {
            name: "{caller}!",
            location: "{location}! The whole kitchen is burning!",
            emergency: "Fire! Started on the stove and spread to the cabinets!",
            reassure: "Thank you! We're all getting out the front door now!"
        }
    },
    {
        type: "Building Fire",
        dialogue: "The fire alarm is going off and I can see flames on the second floor! People are evacuating!",
        correctUnits: ["fire", "multiple"],
        responses: {
            name: "{caller}! I work here!",
            location: "{location}! It's the office building!",
            emergency: "Fire! Second floor is burning! Alarm is going off!",
            reassure: "Okay! I'm helping people get out safely!"
        }
    },
    {
        type: "Gas Leak",
        dialogue: "I smell gas really strong in my house! I turned off the stove but the smell won't go away!",
        correctUnits: ["fire"],
        responses: {
            name: "{caller}!",
            location: "{location}! Should I get out of the house?!",
            emergency: "Gas leak! Can smell it everywhere! It's really strong!",
            reassure: "Okay, I'm opening windows and going outside. Thank you!"
        }
    },
    {
        type: "Chemical Spill",
        dialogue: "We have a chemical spill in our warehouse! Some workers are complaining about breathing problems!",
        correctUnits: ["fire", "multiple"],
        responses: {
            name: "I'm {caller}, the facility manager!",
            location: "{location}! The main warehouse!",
            emergency: "Chemical spill! Workers coughing and having trouble breathing!",
            reassure: "Understood! We're evacuating everyone now!"
        }
    },
    {
        type: "House Fire",
        dialogue: "I woke up to the smoke alarm! There's fire in my garage! It's spreading to the house!",
        correctUnits: ["fire", "multiple"],
        responses: {
            name: "{caller}!",
            location: "{location}!",
            emergency: "Garage fire spreading to house! Lots of smoke!",
            reassure: "We're all outside now! Thank you!"
        }
    },
    // POLICE/CRIME EMERGENCIES
    {
        type: "Burglary in Progress",
        dialogue: "Someone just broke my window! I can hear them downstairs... I'm hiding in my bedroom. Please send help!",
        correctUnits: ["police"],
        responses: {
            name: "{caller}... I'm so scared...",
            location: "{location}. I'm upstairs, they're still down there!",
            emergency: "Break-in! They smashed the window! I can hear them moving!",
            reassure: "*whispers* Thank you... I'll stay quiet up here..."
        }
    },
    {
        type: "Armed Robbery",
        dialogue: "Someone just robbed our store with a weapon! They ran out the back! No one is hurt but we're all shaken!",
        correctUnits: ["police"],
        responses: {
            name: "I'm an employee... I don't want to give my name...",
            location: "{location}!",
            emergency: "Armed robbery! They had a gun! Took money and ran!",
            reassure: "Okay... we're locking the doors and staying inside..."
        }
    },
    {
        type: "Domestic Disturbance",
        dialogue: "I'm a neighbor. I can hear yelling and things breaking next door. It sounds violent. Someone might be hurt.",
        correctUnits: ["police"],
        responses: {
            name: "I'd rather not give my name... I'm just a concerned neighbor.",
            location: "It's {location}. That's where the noise is coming from.",
            emergency: "Yelling, screaming, things crashing. Sounds like a fight!",
            reassure: "Thank you... I hope they're okay..."
        }
    },
    {
        type: "Assault",
        dialogue: "I just saw someone get attacked in the park! The attacker ran away but the victim is on the ground!",
        correctUnits: ["police", "multiple"],
        responses: {
            name: "{caller}. I was jogging when I saw it!",
            location: "Near {location}, in the park by the playground!",
            emergency: "Someone was attacked! Attacker fled but victim is hurt!",
            reassure: "Thank you! I'm staying with the victim until help arrives!"
        }
    },
    {
        type: "Carjacking",
        dialogue: "Someone just stole my car at gunpoint! I'm okay but they just drove off with my vehicle!",
        correctUnits: ["police"],
        responses: {
            name: "{caller}!",
            location: "I'm at {location}!",
            emergency: "Carjacking! They had a gun! Took my car!",
            reassure: "Okay, I'm safe. I can see which way they went!"
        }
    },
    {
        type: "Vandalism in Progress",
        dialogue: "There are people spray-painting the side of our building! They're destroying property!",
        correctUnits: ["police"],
        responses: {
            name: "{caller}. I own the business here.",
            location: "{location}.",
            emergency: "Vandalism! Multiple people defacing property!",
            reassure: "Okay, I'm staying inside and watching them."
        }
    },
    // ACCIDENT EMERGENCIES
    {
        type: "Car Accident",
        dialogue: "I just witnessed a bad car crash! Two cars collided, and people are injured. One car is smoking!",
        correctUnits: ["multiple"],
        responses: {
            name: "I'm {caller}, I was driving by when it happened!",
            location: "It's near {location}!",
            emergency: "Two cars collided! Injuries and one car smoking!",
            reassure: "Okay, I'll stay here and make sure no one else gets hurt!"
        }
    },
    {
        type: "Pedestrian Hit",
        dialogue: "A car just hit someone crossing the street! The driver stopped but the person is hurt!",
        correctUnits: ["multiple"],
        responses: {
            name: "{caller}!",
            location: "At {location}!",
            emergency: "Pedestrian struck by vehicle! Person is down!",
            reassure: "Okay! I'll make sure the person doesn't move!"
        }
    },
    {
        type: "Motorcycle Accident",
        dialogue: "A motorcycle crashed and the rider went flying! They're not moving!",
        correctUnits: ["multiple"],
        responses: {
            name: "{caller}!",
            location: "Near {location}!",
            emergency: "Motorcycle crash! Rider thrown from bike! Unconscious!",
            reassure: "Understood! I won't move them!"
        }
    },
    // VARIOUS OTHER EMERGENCIES
    {
        type: "Child Emergency",
        dialogue: "My child fell from the tree and is crying! Their arm looks wrong and they can't move it!",
        correctUnits: ["ambulance"],
        responses: {
            name: "{caller}! I'm their parent!",
            location: "{location}! In the backyard!",
            emergency: "Child fell from tree! Arm injury, possible break!",
            reassure: "Okay! I'll keep them still! You hear that honey? Help is coming!"
        }
    },
    {
        type: "Animal Attack",
        dialogue: "Someone just got attacked by a dog! The dog ran off but the person is bleeding badly!",
        correctUnits: ["ambulance", "multiple"],
        responses: {
            name: "{caller}!",
            location: "{location}!",
            emergency: "Dog attack! Multiple bite wounds! Heavy bleeding!",
            reassure: "Okay! I'm applying pressure to the wounds!"
        }
    },
    {
        type: "Choking",
        dialogue: "Someone is choking at our restaurant! They can't breathe! We tried the Heimlich but it's not working!",
        correctUnits: ["ambulance"],
        responses: {
            name: "I'm {caller}, I work here!",
            location: "{location}!",
            emergency: "Choking victim! Can't breathe! Heimlich maneuver failed!",
            reassure: "Okay! We'll keep trying!"
        }
    },
    {
        type: "Allergic Reaction",
        dialogue: "My friend ate something and now their throat is swelling! They can barely breathe! I think it's an allergic reaction!",
        correctUnits: ["ambulance"],
        responses: {
            name: "{caller}!",
            location: "{location}!",
            emergency: "Severe allergic reaction! Throat swelling! Difficulty breathing!",
            reassure: "Do they have an EpiPen?! Okay, hurry!"
        }
    },
    {
        type: "Electrocution",
        dialogue: "Someone got shocked working on electrical equipment! They're breathing but unconscious!",
        correctUnits: ["ambulance", "multiple"],
        responses: {
            name: "{caller}!",
            location: "{location}!",
            emergency: "Electrocution! Person unconscious but breathing!",
            reassure: "Power is off now! Okay, I'll make sure they're breathing!"
        }
    },
    {
        type: "Drowning",
        dialogue: "Someone pulled a person out of the pool! They're not breathing! We're doing CPR!",
        correctUnits: ["ambulance"],
        responses: {
            name: "{caller}!",
            location: "{location}!",
            emergency: "Near-drowning! Not breathing! CPR in progress!",
            reassure: "Okay! We'll keep doing CPR!"
        }
    },
    {
        type: "Mental Health Crisis",
        dialogue: "My {relative} is threatening to hurt themselves! They're very agitated and won't calm down!",
        correctUnits: ["police", "multiple"],
        responses: {
            name: "{caller}...",
            location: "{location}...",
            emergency: "Mental health crisis! Person threatening self-harm!",
            reassure: "Okay... I'll try to keep them calm and safe..."
        }
    },
    {
        type: "Shooting",
        dialogue: "I heard gunshots! Someone's been shot! There's a lot of blood!",
        correctUnits: ["multiple"],
        responses: {
            name: "{caller}!",
            location: "{location}!",
            emergency: "Gunshot wound! Heavy bleeding! Shooter may still be around!",
            reassure: "Okay! I'm taking cover and staying with the victim!"
        }
    },
    {
        type: "Stabbing",
        dialogue: "Someone's been stabbed! I found them on the ground! They're bleeding really bad!",
        correctUnits: ["multiple"],
        responses: {
            name: "{caller}!",
            location: "{location}!",
            emergency: "Stab wound! Severe bleeding! Victim conscious!",
            reassure: "Okay! I'm applying pressure!"
        }
    }
];

// Relative/pronoun options for dialogue variation
const relatives = ["father", "mother", "husband", "wife", "friend", "roommate", "partner"];
const pronounPairs = [
    { pronoun: "his", Pronoun: "He's" },
    { pronoun: "her", Pronoun: "She's" },
    { pronoun: "their", Pronoun: "They're" }
];

// Generate a call from a template
function generateCall() {
    const template = getRandomElement(emergencyTemplates);
    const callerName = generateRandomName();
    const location = generateRandomAddress();
    const relative = getRandomElement(relatives);
    const pronounSet = getRandomElement(pronounPairs);
    
    // Replace placeholders in dialogue
    let dialogue = template.dialogue
        .replace(/{caller}/g, callerName)
        .replace(/{location}/g, location)
        .replace(/{relative}/g, relative)
        .replace(/{pronoun}/g, pronounSet.pronoun)
        .replace(/{Pronoun}/g, pronounSet.Pronoun);
    
    // Replace placeholders in responses
    const responses = {};
    for (const [key, value] of Object.entries(template.responses)) {
        responses[key] = value
            .replace(/{caller}/g, callerName)
            .replace(/{location}/g, location)
            .replace(/{relative}/g, relative)
            .replace(/{pronoun}/g, pronounSet.pronoun)
            .replace(/{Pronoun}/g, pronounSet.Pronoun);
    }
    
    return {
        type: template.type,
        caller: callerName,
        location: location,
        dialogue: dialogue,
        correctUnits: template.correctUnits,
        responses: responses
    };
}

// (Old static emergency scenarios removed - now using dynamic generation with generateCall())

function startGame() {
    // Fade out and stop menu music
    const menuMusic = document.getElementById('menuMusic');
    if (menuMusic) {
        fadeOutMusic(menuMusic, 1000);
        console.log('Menu music fading out...');
    }
    
    // Fade out menu
    const mainMenu = document.getElementById('mainMenu');
    mainMenu.style.opacity = '0';
    
    setTimeout(() => {
        mainMenu.style.display = 'none';
        document.getElementById('gameScreen').style.display = 'block';
        gameActive = true;
        score = 0;
        callsCompleted = 0;
        correctDispatches = 0;
        totalDispatches = 0;
        updateHUD();
        scheduleNextCall();
    }, 1000);
}

function scheduleNextCall() {
    if (!gameActive) return;
    
    // Random delay between 3-7 seconds
    const delay = Math.random() * 4000 + 3000;
    setTimeout(() => {
        if (gameActive && !currentCall) {
            startRinging();
        }
    }, delay);
}

function startRinging() {
    const phone = document.getElementById('phone');
    phone.classList.add('ringing');
    document.getElementById('callStatus').textContent = '📞 INCOMING CALL - Answer Now!';
}

// Typing animation function
async function typeText(element, text, speed = 30) {
    typingInProgress = true;
    element.textContent = '';
    
    for (let i = 0; i < text.length; i++) {
        element.textContent += text.charAt(i);
        await new Promise(resolve => setTimeout(resolve, speed));
    }
    
    typingInProgress = false;
}

// Ask follow-up question
async function askQuestion(type) {
    if (!currentCall || typingInProgress) return;
    
    // Disable all question buttons during response
    const buttons = document.querySelectorAll('.question-btn');
    buttons.forEach(btn => btn.disabled = true);
    
    typingInProgress = true;
    
    // Get the response
    const response = currentCall.responses[type];
    
    // Add dispatcher's question first
    const dialogueElement = document.getElementById('callerDialogue');
    
    let questionText = '';
    switch(type) {
        case 'name':
            questionText = '\n\n[You: What is your name?]\n';
            break;
        case 'location':
            questionText = '\n\n[You: Where are you located?]\n';
            break;
        case 'emergency':
            questionText = '\n\n[You: Can you describe the emergency?]\n';
            break;
        case 'reassure':
            questionText = '\n\n[You: Stay calm, help is on the way.]\n';
            break;
    }
    
    // Add the question instantly
    dialogueElement.textContent += questionText;
    
    // Wait a moment
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Type only the response character by character
    for (let i = 0; i < response.length; i++) {
        dialogueElement.textContent += response.charAt(i);
        await new Promise(resolve => setTimeout(resolve, 30));
    }
    
    typingInProgress = false;
    
    // Re-enable question buttons
    buttons.forEach(btn => btn.disabled = false);
}

function pickUpPhone() {
    if (!currentCall && !typingInProgress) {
        const phone = document.getElementById('phone');
        phone.classList.remove('ringing');
        
        // Generate random call with dynamic names and locations
        currentCall = generateCall();
        selectedUnits = [];
        
        // Display call information
        document.getElementById('noCallMessage').classList.add('hidden');
        document.getElementById('callInfo').classList.add('active');
        
        // Clear input fields
        document.getElementById('callerName').value = '';
        document.getElementById('location').value = '';
        document.getElementById('emergencyType').value = '';
        document.getElementById('notes').value = '';
        
        // Disable dispatch buttons until typing is complete
        document.getElementById('policeBtn').disabled = true;
        document.getElementById('fireBtn').disabled = true;
        document.getElementById('ambulanceBtn').disabled = true;
        document.getElementById('multipleBtn').disabled = true;
        
        // Update status
        document.getElementById('callStatus').innerHTML = '✅ Call Active<br>Listen and take notes';
        
        // Hide feedback
        document.getElementById('feedback').style.display = 'none';
        document.getElementById('feedback').classList.remove('correct', 'incorrect');
        
        // Start typing animation
        const dialogueElement = document.getElementById('callerDialogue');
        typeText(dialogueElement, `"${currentCall.dialogue}"`).then(() => {
            // Show question buttons
            document.getElementById('questionButtons').style.display = 'grid';
            
            // Enable dispatch buttons after dialogue is complete
            document.getElementById('policeBtn').disabled = false;
            document.getElementById('fireBtn').disabled = false;
            document.getElementById('ambulanceBtn').disabled = false;
            document.getElementById('multipleBtn').disabled = false;
            document.getElementById('callStatus').innerHTML = '✅ Call Active<br>Ask questions and fill form';
        });
    }
}

function selectUnit(unit) {
    const buttons = {
        police: document.getElementById('policeBtn'),
        fire: document.getElementById('fireBtn'),
        ambulance: document.getElementById('ambulanceBtn'),
        multiple: document.getElementById('multipleBtn')
    };

    if (unit === 'multiple') {
        // Select all units
        selectedUnits = ['police', 'fire', 'ambulance'];
        buttons.police.style.opacity = '1';
        buttons.fire.style.opacity = '1';
        buttons.ambulance.style.opacity = '1';
        buttons.multiple.style.opacity = '1';
    } else {
        if (selectedUnits.includes(unit)) {
            // Deselect
            selectedUnits = selectedUnits.filter(u => u !== unit);
            buttons[unit].style.opacity = '1';
        } else {
            // Select
            selectedUnits.push(unit);
            buttons[unit].style.opacity = '0.7';
        }
        
        // Check if multiple units selected
        if (selectedUnits.length > 1) {
            buttons.multiple.style.opacity = '0.7';
        } else {
            buttons.multiple.style.opacity = '1';
        }
    }

    // Enable submit button if at least one unit selected
    document.getElementById('submitBtn').disabled = selectedUnits.length === 0;
}

// Helper function to check if input matches (with leniency)
function checkMatch(input, correct) {
    if (!input) return false;
    
    const inputLower = input.toLowerCase().trim();
    const correctLower = correct.toLowerCase().trim();
    
    // Exact match
    if (inputLower === correctLower) return true;
    
    // Contains match (for addresses and names)
    if (inputLower.includes(correctLower) || correctLower.includes(inputLower)) {
        // Must be at least 50% of the correct answer
        return inputLower.length >= correctLower.length * 0.5;
    }
    
    // Check if key words match (for emergency types)
    const inputWords = inputLower.split(/\s+/);
    const correctWords = correctLower.split(/\s+/);
    let matchingWords = 0;
    
    for (const word of inputWords) {
        if (correctWords.some(cw => cw.includes(word) || word.includes(cw))) {
            matchingWords++;
        }
    }
    
    return matchingWords >= Math.min(2, correctWords.length);
}

// Specialized emergency type checker with keyword matching
function checkEmergencyType(input, correctType) {
    if (!input) return false;
    
    const inputLower = input.toLowerCase().trim();
    const correctLower = correctType.toLowerCase().trim();
    
    // Exact match
    if (inputLower === correctLower) return true;
    
    // Contains match
    if (inputLower.includes(correctLower) || correctLower.includes(inputLower)) return true;
    
    // Define emergency keywords for each type
    const emergencyKeywords = {
        "medical emergency": ["medical", "health", "sick", "injured", "hurt", "collapsed", "unconscious", "breathing", "heart", "pain", "bleeding", "ambulance", "emergency", "fell", "seizure", "fever", "chest"],
        "overdose": ["overdose", "pills", "drugs", "medication", "poison", "unresponsive", "took"],
        "severe bleeding": ["bleeding", "blood", "cut", "laceration", "wound", "injury", "saw", "knife"],
        "house fire": ["fire", "smoke", "burning", "flames", "blaze", "kitchen", "garage"],
        "building fire": ["fire", "smoke", "burning", "flames", "blaze", "building", "alarm", "floor"],
        "gas leak": ["gas", "leak", "smell", "fumes", "natural gas", "stove"],
        "chemical spill": ["chemical", "spill", "hazmat", "toxic", "fumes", "leak", "exposure", "warehouse"],
        "burglary in progress": ["burglary", "burglar", "break-in", "broke in", "intruder", "breaking", "thief", "window", "downstairs"],
        "armed robbery": ["robbery", "robbed", "armed", "weapon", "gun", "knife", "holdup", "theft", "store"],
        "domestic disturbance": ["domestic", "disturbance", "fight", "fighting", "yelling", "violence", "neighbor", "arguing", "breaking"],
        "assault": ["assault", "attack", "attacked", "fighting", "beaten", "violence", "violent", "victim"],
        "carjacking": ["carjacking", "stole", "car", "gunpoint", "vehicle", "stolen"],
        "vandalism in progress": ["vandalism", "spray-painting", "defacing", "property", "graffiti"],
        "car accident": ["accident", "crash", "collision", "car", "vehicle", "hit", "wreck", "collided"],
        "pedestrian hit": ["pedestrian", "hit", "crossing", "street", "struck", "car"],
        "motorcycle accident": ["motorcycle", "crash", "rider", "bike", "thrown"],
        "child emergency": ["child", "kid", "son", "daughter", "boy", "girl", "fell", "injured", "hurt", "tree", "arm", "leg"],
        "animal attack": ["animal", "dog", "attack", "bite", "bitten", "pet"],
        "choking": ["choking", "choke", "breathe", "heimlich", "throat", "restaurant"],
        "allergic reaction": ["allergic", "allergy", "reaction", "swelling", "throat", "epipen", "breathing"],
        "electrocution": ["electrocution", "shocked", "electrical", "electricity", "unconscious"],
        "drowning": ["drowning", "drown", "pool", "water", "cpr", "breathing"],
        "mental health crisis": ["mental", "health", "crisis", "threatening", "harm", "agitated", "suicide"],
        "shooting": ["shooting", "shot", "gunshot", "gun", "firearm", "wounded"],
        "stabbing": ["stabbing", "stabbed", "knife", "stab", "blade", "cut"]
    };
    
    // Get keywords for this emergency type
    let keywords = emergencyKeywords[correctLower] || [];
    
    // Also add individual words from the correct type as keywords
    keywords = [...keywords, ...correctLower.split(/\s+/)];
    
    // Check if input contains any relevant keywords
    const inputWords = inputLower.split(/\s+/);
    let keywordMatches = 0;
    
    for (const keyword of keywords) {
        if (inputWords.some(word => word.includes(keyword) || keyword.includes(word))) {
            keywordMatches++;
        }
    }
    
    // Accept if at least 1 relevant keyword found
    return keywordMatches >= 1;
}

function submitDispatch() {
    if (selectedUnits.length === 0 || !currentCall) return;

    totalDispatches++;
    
    // Get user inputs
    const enteredName = document.getElementById('callerName').value;
    const enteredLocation = document.getElementById('location').value;
    const enteredType = document.getElementById('emergencyType').value;
    
    // Check form completion
    let formBonus = 0;
    let formFeedback = [];
    
    if (checkMatch(enteredName, currentCall.caller)) {
        formBonus += 25;
        formFeedback.push('✓ Name');
    } else if (enteredName.trim()) {
        formFeedback.push('✗ Name');
    }
    
    if (checkMatch(enteredLocation, currentCall.location)) {
        formBonus += 25;
        formFeedback.push('✓ Location');
    } else if (enteredLocation.trim()) {
        formFeedback.push('✗ Location');
    }
    
    if (checkEmergencyType(enteredType, currentCall.type)) {
        formBonus += 25;
        formFeedback.push('✓ Emergency Type');
    } else if (enteredType.trim()) {
        formFeedback.push('✗ Emergency Type');
    }
    
    // Check if dispatch is correct
    let dispatchCorrect = false;
    
    // Check if player selected the right units
    if (currentCall.correctUnits.includes('multiple')) {
        // Multiple units required
        dispatchCorrect = selectedUnits.length >= 2;
    } else if (currentCall.correctUnits.length === 1) {
        // Single unit type
        dispatchCorrect = selectedUnits.includes(currentCall.correctUnits[0]);
    } else {
        // Either of the correct units is acceptable
        dispatchCorrect = currentCall.correctUnits.some(unit => selectedUnits.includes(unit));
    }

    const feedback = document.getElementById('feedback');
    let feedbackText = '';
    
    if (dispatchCorrect) {
        correctDispatches++;
        score += 100;
        feedbackText = '✅ CORRECT DISPATCH!\n';
    } else {
        score -= 25;
        feedbackText = `❌ WRONG UNITS! Needed: ${currentCall.correctUnits.join(' or ').toUpperCase()}\n`;
    }
    
    // Add form accuracy feedback
    score += formBonus;
    if (formFeedback.length > 0) {
        feedbackText += formFeedback.join(' | ');
        feedbackText += `\n+${formBonus} bonus points`;
    } else {
        feedbackText += 'No form filled - missed bonus points!';
    }
    
    feedback.innerHTML = feedbackText.replace(/\n/g, '<br>');
    
    if (dispatchCorrect) {
        feedback.classList.add('correct');
        feedback.classList.remove('incorrect');
    } else {
        feedback.classList.add('incorrect');
        feedback.classList.remove('correct');
    }

    feedback.style.display = 'block';
    
    callsCompleted++;
    updateHUD();

    // Reset after delay
    setTimeout(() => {
        closeCall();
        
        // Check if game should end (after 10 calls)
        if (callsCompleted >= 10) {
            endGame();
        } else {
            scheduleNextCall();
        }
    }, 4000);
}

function closeCall() {
    currentCall = null;
    selectedUnits = [];
    typingInProgress = false;
    
    document.getElementById('callInfo').classList.remove('active');
    document.getElementById('noCallMessage').classList.remove('hidden');
    document.getElementById('callStatus').textContent = 'Waiting for incoming call...';
    document.getElementById('callerDialogue').textContent = '_';
    document.getElementById('questionButtons').style.display = 'none';
    
    // Clear input fields
    document.getElementById('callerName').value = '';
    document.getElementById('location').value = '';
    document.getElementById('emergencyType').value = '';
    document.getElementById('notes').value = '';
    
    // Disable and reset buttons
    document.getElementById('policeBtn').disabled = true;
    document.getElementById('fireBtn').disabled = true;
    document.getElementById('ambulanceBtn').disabled = true;
    document.getElementById('multipleBtn').disabled = true;
    document.getElementById('submitBtn').disabled = true;
    
    document.getElementById('policeBtn').style.opacity = '1';
    document.getElementById('fireBtn').style.opacity = '1';
    document.getElementById('ambulanceBtn').style.opacity = '1';
    document.getElementById('multipleBtn').style.opacity = '1';
    
    document.getElementById('feedback').style.display = 'none';
}

function updateHUD() {
    document.getElementById('scoreValue').textContent = score;
    document.getElementById('callsValue').textContent = callsCompleted;
    
    const accuracy = totalDispatches > 0 
        ? Math.round((correctDispatches / totalDispatches) * 100) 
        : 100;
    document.getElementById('accuracyValue').textContent = accuracy;
}

function endGame() {
    gameActive = false;
    document.getElementById('gameScreen').style.display = 'none';
    document.getElementById('gameOverScreen').style.display = 'flex';
    
    const accuracy = totalDispatches > 0 
        ? Math.round((correctDispatches / totalDispatches) * 100) 
        : 100;
    
    document.getElementById('finalScore').textContent = score;
    document.getElementById('finalCalls').textContent = callsCompleted;
    document.getElementById('finalAccuracy').textContent = accuracy;
}

function restartGame() {
    document.getElementById('gameOverScreen').style.display = 'none';
    closeCall();
    startGame();
}

function backToMenu() {
    document.getElementById('gameOverScreen').style.display = 'none';
    const mainMenu = document.getElementById('mainMenu');
    mainMenu.style.display = 'flex';
    mainMenu.style.opacity = '1'; // Ensure menu is visible
    closeCall();
    
    // Restart menu music
    const menuMusic = document.getElementById('menuMusic');
    if (menuMusic) {
        menuMusic.volume = 0.5; // Reset volume
        menuMusic.currentTime = 0; // Start from beginning
        menuMusic.play().then(() => {
            console.log('Menu music restarted');
        }).catch(e => console.log('Audio play failed:', e));
    }
}

// Accept disclaimer and start loading
function acceptDisclaimer() {
    const disclaimerModal = document.getElementById('disclaimerModal');
    const loadingScreen = document.getElementById('loadingScreen');
    const menuMusic = document.getElementById('menuMusic');
    
    // Fade out disclaimer
    disclaimerModal.classList.add('fade-out');
    
    // Start music completely silent to prevent stuttering
    if (menuMusic) {
        menuMusic.volume = 0; // Start completely silent
        menuMusic.play().then(() => {
            console.log('Music started playing after disclaimer acceptance!');
            // Gradually fade in during loading screen (to quiet background level)
            setTimeout(() => {
                fadeInMusic(menuMusic, 0.15, 2000);
            }, 500);
        }).catch(e => {
            console.error('Music play failed:', e);
        });
    }
    
    // Wait for fade, then show loading screen
    setTimeout(() => {
        disclaimerModal.style.display = 'none';
        loadingScreen.style.display = 'flex';
        startLoadingSequence();
    }, 1000);
}

// Loading sequence with realistic variable speeds and stutters
function startLoadingSequence() {
    const loadingBar = document.getElementById('loadingBar');
    const loadingPercentage = document.getElementById('loadingPercentage');
    const loadingStatus = document.getElementById('loadingStatus');
    const loadingScreen = document.getElementById('loadingScreen');
    const mainMenu = document.getElementById('mainMenu');
    const menuMusic = document.getElementById('menuMusic');
    
    const statuses = [
        'Connecting to emergency database...',
        'Loading dispatch protocols...',
        'Initializing call routing system...',
        'Configuring emergency units...',
        'Synchronizing with dispatch center...',
        'Loading emergency scenarios...',
        'Preparing communication systems...',
        'Calibrating response protocols...',
        'Finalizing dispatcher terminal...',
        'System ready. Starting...'
    ];
    
    let progress = 0;
    let currentSpeed = 1;
    let stutterTimer = 0;
    let isStuttering = false;
    let nextStutterCheck = Math.random() * 2000 + 1000; // Check for stutter every 1-3 seconds
    
    let statusIndex = 0;
    let elapsedTime = 0;
    const totalTime = 15000; // Must total exactly 15 seconds
    const updateInterval = 50; // Update every 50ms for smoother animation
    
    // Define loading segments with different speeds (will auto-adjust to fit 15 seconds)
    const segments = [
        { end: 10, speed: 0.8 },   // Slow start
        { end: 25, speed: 1.5 },   // Speed up
        { end: 40, speed: 1.0 },   // Normal
        { end: 55, speed: 0.6 },   // Slow down (major load)
        { end: 70, speed: 1.8 },   // Fast catch-up
        { end: 85, speed: 1.2 },   // Normal-ish
        { end: 95, speed: 0.7 },   // Slow finale
        { end: 100, speed: 1.0 }   // Final push
    ];
    
    let currentSegment = 0;
    
    const loadingInterval = setInterval(() => {
        elapsedTime += updateInterval;
        
        // Random stutters (pauses)
        stutterTimer += updateInterval;
        if (stutterTimer >= nextStutterCheck && !isStuttering && progress < 95) {
            // 30% chance of stutter
            if (Math.random() < 0.3) {
                isStuttering = true;
                setTimeout(() => {
                    isStuttering = false;
                }, Math.random() * 400 + 200); // Stutter for 200-600ms
            }
            stutterTimer = 0;
            nextStutterCheck = Math.random() * 2000 + 1000;
        }
        
        // Don't update progress during stutter
        if (!isStuttering) {
            // Determine current segment speed
            while (currentSegment < segments.length - 1 && progress >= segments[currentSegment].end) {
                currentSegment++;
            }
            currentSpeed = segments[currentSegment].speed;
            
            // Calculate increment to ensure we finish in exactly 15 seconds
            const baseIncrement = (100 / (totalTime / updateInterval));
            progress += baseIncrement * currentSpeed;
            
            // Clamp progress to 100
            if (progress > 100) progress = 100;
        }
        
        // Force completion at 15 seconds regardless
        if (elapsedTime >= totalTime) {
            progress = 100;
        }
        
        if (progress >= 100) {
            progress = 100;
            clearInterval(loadingInterval);
            
            // Fade out loading screen
            setTimeout(() => {
                loadingStatus.textContent = statuses[statuses.length - 1];
                loadingBar.style.width = '100%';
                loadingPercentage.textContent = '100%';
                
                setTimeout(() => {
                    loadingScreen.classList.add('fade-out');
                    
                    // Show menu and fade in music
                    setTimeout(() => {
                        loadingScreen.style.display = 'none';
                        mainMenu.style.display = 'flex';
                        
                        // Fade in menu
                        setTimeout(() => {
                            mainMenu.style.opacity = '1';
                        }, 50);
                        
                        // Fade in music to full volume over 3 seconds
                        if (menuMusic) {
                            fadeInMusic(menuMusic, 0.5, 3000);
                        }
                    }, 1500);
                }, 500);
            }, 100);
        } else {
            // Update progress bar with slight easing for smoothness
            const displayProgress = Math.floor(progress);
            loadingBar.style.width = progress + '%';
            loadingPercentage.textContent = displayProgress + '%';
            
            // Update status text based on progress
            const currentStatusIndex = Math.floor((progress / 100) * statuses.length);
            if (currentStatusIndex !== statusIndex && currentStatusIndex < statuses.length) {
                statusIndex = currentStatusIndex;
                loadingStatus.textContent = statuses[statusIndex];
            }
        }
    }, updateInterval);
}

// Fade in music gradually (smoothed to prevent audio stuttering)
function fadeInMusic(audioElement, targetVolume, duration) {
    const startVolume = audioElement.volume;
    const steps = 60; // Fixed number of steps for smoother transition
    const volumeStep = (targetVolume - startVolume) / steps;
    const stepTime = duration / steps;
    
    let currentStep = 0;
    
    const fadeInterval = setInterval(() => {
        currentStep++;
        if (currentStep <= steps) {
            const newVolume = startVolume + (volumeStep * currentStep);
            audioElement.volume = Math.max(0, Math.min(newVolume, targetVolume));
        } else {
            clearInterval(fadeInterval);
            audioElement.volume = targetVolume;
        }
    }, stepTime);
}

// Fade out music gradually (smoothed to prevent audio stuttering)
function fadeOutMusic(audioElement, duration) {
    const startVolume = audioElement.volume;
    const steps = 40; // Fixed number of steps
    const volumeStep = startVolume / steps;
    const stepTime = duration / steps;
    
    let currentStep = 0;
    
    const fadeInterval = setInterval(() => {
        currentStep++;
        if (currentStep <= steps) {
            const newVolume = startVolume - (volumeStep * currentStep);
            audioElement.volume = Math.max(0, Math.min(newVolume, 1));
        } else {
            clearInterval(fadeInterval);
            audioElement.volume = 0;
            audioElement.pause();
            audioElement.currentTime = 0;
        }
    }, stepTime);
}

// ============================================
// SAVE/LOAD SYSTEM FOR ELECTRON
// ============================================

// Check if running in Electron
const isElectron = window.electronAPI && window.electronAPI.isElectron;

// Save game state
async function saveGame(saveName = 'quicksave') {
    if (!isElectron) {
        alert('Save system only available in desktop version!');
        return;
    }
    
    const saveData = {
        saveName: saveName,
        score: score,
        callsCompleted: callsCompleted,
        correctDispatches: correctDispatches,
        totalDispatches: totalDispatches,
        lives: 3, // Add lives tracking if needed
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    };
    
    try {
        const result = await window.electronAPI.saveGame(saveData);
        
        if (result.success) {
            showNotification(`Game saved successfully! (${result.fileName})`, 'success');
            console.log('Game saved:', result.path);
        } else {
            showNotification(`Save failed: ${result.error}`, 'error');
        }
    } catch (error) {
        console.error('Save error:', error);
        showNotification('Failed to save game', 'error');
    }
}

// Load game state
async function loadGame(fileName) {
    if (!isElectron) {
        alert('Save system only available in desktop version!');
        return;
    }
    
    try {
        const result = await window.electronAPI.loadGame(fileName);
        
        if (result.success) {
            const saveData = result.data;
            
            // Restore game state
            score = saveData.score || 0;
            callsCompleted = saveData.callsCompleted || 0;
            correctDispatches = saveData.correctDispatches || 0;
            totalDispatches = saveData.totalDispatches || 0;
            
            // Update UI
            updateScore();
            
            showNotification('Game loaded successfully!', 'success');
            console.log('Game loaded from:', fileName);
            
            // Close load menu and start game
            closeSaveLoadMenu();
            if (!gameActive) {
                startGame();
            }
        } else {
            showNotification(`Load failed: ${result.error}`, 'error');
        }
    } catch (error) {
        console.error('Load error:', error);
        showNotification('Failed to load game', 'error');
    }
}

// List all save files
async function refreshSavesList() {
    if (!isElectron) return;
    
    try {
        const result = await window.electronAPI.listSaves();
        
        if (result.success) {
            displaySavesList(result.saves);
        } else {
            console.error('Failed to list saves:', result.error);
        }
    } catch (error) {
        console.error('Error listing saves:', error);
    }
}

// Display saves in the UI
function displaySavesList(saves) {
    const savesList = document.getElementById('savesList');
    if (!savesList) return;
    
    if (saves.length === 0) {
        savesList.innerHTML = '<div class="no-saves">No save games found</div>';
        return;
    }
    
    savesList.innerHTML = saves.map((save, index) => {
        const date = new Date(save.date).toLocaleString();
        return `
            <div class="save-item">
                <div class="save-info">
                    <div class="save-name">${save.saveName}</div>
                    <div class="save-stats">
                        Score: ${save.score} | Calls: ${save.callsCompleted} | Lives: ${save.lives}
                    </div>
                    <div class="save-date">${date}</div>
                </div>
                <div class="save-actions">
                    <button class="save-action-btn load-btn" onclick="loadGame('${save.fileName}')">LOAD</button>
                    <button class="save-action-btn delete-btn" onclick="deleteSave('${save.fileName}')">DELETE</button>
                </div>
            </div>
        `;
    }).join('');
}

// Delete a save file
async function deleteSave(fileName) {
    if (!isElectron) return;
    
    if (!confirm('Are you sure you want to delete this save?')) {
        return;
    }
    
    try {
        const result = await window.electronAPI.deleteSave(fileName);
        
        if (result.success) {
            showNotification('Save deleted', 'success');
            refreshSavesList();
        } else {
            showNotification(`Delete failed: ${result.error}`, 'error');
        }
    } catch (error) {
        console.error('Delete error:', error);
        showNotification('Failed to delete save', 'error');
    }
}

// Open saves folder in file explorer
async function openSavesFolder() {
    if (!isElectron) return;
    
    try {
        await window.electronAPI.openSavesFolder();
    } catch (error) {
        console.error('Failed to open saves folder:', error);
    }
}

// Show save/load menu
function showSaveLoadMenu(mode = 'load') {
    const menu = document.getElementById('saveLoadMenu');
    const title = document.getElementById('saveLoadTitle');
    const saveNameContainer = document.getElementById('saveNameContainer');
    const saveGameBtn = document.getElementById('saveGameBtn');
    
    if (!menu) return;
    
    menu.style.display = 'flex';
    
    if (mode === 'save') {
        title.textContent = 'SAVE GAME';
        saveNameContainer.style.display = 'block';
        saveGameBtn.style.display = 'block';
    } else {
        title.textContent = 'LOAD GAME';
        saveNameContainer.style.display = 'none';
        saveGameBtn.style.display = 'none';
    }
    
    refreshSavesList();
}

// Close save/load menu
function closeSaveLoadMenu() {
    const menu = document.getElementById('saveLoadMenu');
    if (menu) {
        menu.style.display = 'none';
    }
}

// Perform save with custom name
function performSave() {
    const saveNameInput = document.getElementById('saveNameInput');
    const saveName = saveNameInput.value.trim() || 'quicksave';
    saveGame(saveName);
    saveNameInput.value = '';
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
    const menuMusic = document.getElementById('menuMusic');
    
    if (menuMusic) {
        // Add listener for error loading
        menuMusic.addEventListener('error', (e) => {
            console.error('Error loading music file:', e);
            console.error('Current src:', menuMusic.currentSrc);
        });
        
        menuMusic.addEventListener('canplay', () => {
            console.log('Music file loaded successfully and can play');
        });
    } else {
        console.error('Menu music element not found!');
    }
    
    // Log Electron status
    if (isElectron) {
        console.log('Running in Electron - Save system enabled');
    } else {
        console.log('Running in browser - Save system disabled');
    }
});

