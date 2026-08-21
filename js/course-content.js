/* Authored training content. Each entry is a teachable lesson, not a catalogue label. */
(function(){
  window.COURSE_CONTENT={
    foundations:{
      durationMinutes:35,
      objectives:['Distinguish plaintext, ciphertext, key and algorithm.','Separate confidentiality from integrity and authenticity.','Identify an observer, tamperer and impersonator in a communication channel.'],
      terms:[['Plaintext','The readable message before cryptographic transformation.'],['Ciphertext','The transformed message intended to hide the plaintext.'],['Key','Secret or public information that controls a cryptographic operation.'],['Integrity','Confidence that data was not changed.'],['Authenticity','Confidence about who created or sent data.']],
      sections:[
        {label:'Why cryptography exists',title:'A message crosses an untrusted channel',text:'Cryptography does not begin with an algorithm. It begins with a communication problem: Alice needs to send information to Bob while a third party may observe, change or impersonate the participants. Different threats require different properties.'},
        {label:'Threat model',title:'Name the attacker before choosing the tool',text:'An eavesdropper can read traffic but not change it. A tamperer can alter a message in transit. An impersonator can pretend to be Alice. Encryption helps with confidentiality; authentication and integrity require additional mechanisms.'},
        {label:'Worked example',title:'One message, four security questions',text:'For “Transfer 100 credits”, ask: Can an observer read it? Can a tamperer change 100 to 900? Can Bob verify Alice sent it? Can the system detect a replay? These are separate questions, and no single historical cipher answers all of them.'},
        {label:'Discussion',title:'Security is a system property',text:'A strong algorithm can still be used unsafely through weak keys, repeated nonces, unauthenticated key exchange or poor implementation. Throughout this course, inspect the construction and the protocol around it.'}
      ],
      check:{question:'A message is encrypted but an attacker can silently modify it. Which property is missing?',answers:['Integrity/authentication','Confidentiality','Compression'],correct:0,explanation:'Encryption may hide content without proving it was not modified. Authenticated encryption or a MAC/signature is needed.'}
    },
    caesar:{
      durationMinutes:35,
      objectives:['Explain substitution using an alphabet permutation.','Calculate encryption and decryption with modular arithmetic.','Perform a brute-force attack against the small key space.'],
      terms:[['Substitution','Replacing each symbol with another symbol.'],['Key space','The set of all possible keys an attacker must try.'],['Modulo 26','Wrap-around arithmetic over the 26 letters of the English alphabet.']],
      sections:[
        {label:'Context',title:'A fixed shift creates a secret alphabet',text:'The Caesar cipher replaces every letter with the letter a fixed distance away. Julius Caesar reportedly used a shift of three. The construction is useful because the transformation is visible, but that same regularity makes it easy to attack.'},
        {label:'Formula',title:'Encryption and decryption',formula:'E(x) = (x + k) mod 26    ·    D(x) = (x − k) mod 26',text:'Represent A as 0 and Z as 25. With key k = 3, H is 7, so (7 + 3) mod 26 = 10, which is K. Decryption subtracts the same key and wraps around when the value becomes negative.'},
        {label:'Worked example',title:'HELLO with key 3',example:[['H','7 + 3 = 10','K'],['E','4 + 3 = 7','H'],['L','11 + 3 = 14','O'],['L','11 + 3 = 14','O'],['O','14 + 3 = 17','R']],text:'The output is KHOOR. Spaces and punctuation are normally preserved, which can leak additional structure.'},
        {label:'Attack',title:'Brute force is enough',text:'There are only 26 shifts, and one is the unchanged alphabet. An attacker can try every key, score the results as language, and select the readable candidate. A secret that can be tested exhaustively is not a secure modern key.'}
      ],
      check:{question:'Why can a Caesar cipher be broken without knowing the key?',answers:['The key space is tiny enough to exhaustively search.','The ciphertext is always longer than the plaintext.','Caesar uses public-key encryption.'],correct:0,explanation:'Only 26 shifts exist. Trying every shift is inexpensive, and natural language makes the correct result recognizable.'}
    },
    frequency:{
      durationMinutes:40,
      objectives:['Explain why substitution preserves language statistics.','Use a frequency table to propose plaintext mappings.','Distinguish a useful clue from a complete decryption.'],
      terms:[['Frequency analysis','Using symbol counts and language patterns to attack substitution.'],['Monoalphabetic','A substitution where one plaintext symbol always maps to one ciphertext symbol.'],['Bigram','A pair of consecutive symbols such as TH or ER.']],
      sections:[
        {label:'Observation',title:'Symbols change, statistics survive',text:'A monoalphabetic substitution changes the appearance of letters but not how often the underlying language uses them. In English, E, T, A and O are common, while Q and Z are rare. The exact order varies by message, but the signal accumulates in longer ciphertexts.'},
        {label:'Worked example',title:'From counts to hypotheses',text:'Count every ciphertext symbol, rank the results, and compare the shape with an English frequency chart. If X appears most often, E is a reasonable first hypothesis—but it is not proof. Test the hypothesis against common bigrams and word patterns.'},
        {label:'Guided method',title:'Attack in layers',text:'Start with single-letter frequency, then inspect repeated two- and three-letter sequences, word lengths and likely words. Every proposed mapping should be checked against the whole message; a locally plausible guess can create contradictions elsewhere.'},
        {label:'Failure boundary',title:'Frequency is not magic',text:'Short messages do not contain enough statistical evidence. Polyalphabetic ciphers, homophones and modern encryption deliberately disrupt these patterns. The attack works because the substitution is fixed, not because frequency analysis defeats all cryptography.'}
      ],
      check:{question:'Why is frequency analysis more reliable on a long monoalphabetic ciphertext?',answers:['More symbols reveal stable language statistics.','Long messages always use a larger key.','Frequency analysis requires a quantum computer.'],correct:0,explanation:'A larger sample makes the underlying distribution and repeated patterns easier to distinguish from random variation.'}
    },
    rail:{
      durationMinutes:30,
      objectives:['Distinguish transposition from substitution.','Trace the zig-zag writing and reading order.','Explain why rearranging symbols does not hide language statistics.'],
      terms:[['Transposition','Reordering symbols without changing the symbols themselves.'],['Rail','A row used by the zig-zag writing path.'],['Permutation','A rearrangement of positions.']],
      sections:[
        {label:'Concept',title:'The letters stay; their positions move',text:'Rail Fence writes a message diagonally across a chosen number of rows, then reads each row. Unlike Caesar, it does not replace any symbol. This makes the distinction between substitution and transposition concrete.'},
        {label:'Worked example',title:'HELLOWORLD on three rails',text:'Write H-E-L-L-O-W-O-R-L-D in a down-and-up zig-zag. Read the first rail, then the second, then the third. The ciphertext is a permutation of the original letters, so letter frequencies are unchanged.'},
        {label:'Attack',title:'Small structure means small search',text:'If the rail count is small and the message is long, an attacker can test each possible rail count and inspect the resulting shape. Transposition alone does not provide modern confidentiality.'}
      ],
      check:{question:'What does Rail Fence change?',answers:['The positions of symbols.','The identity of every symbol.','The cryptographic hash only.'],correct:0,explanation:'Rail Fence is a transposition cipher: the symbols remain, but their order changes.'}
    }
  };
})();
