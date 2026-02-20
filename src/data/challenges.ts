
export interface Challenge {
    title: string;
    description: string;
    points: number;
    difficulty: "Easy" | "Medium" | "Hard";
    hash: string;
    downloadLink?: string;
}

export const ROUND1_CHALLENGES: Challenge[] = [
    {
        title: "Privilege Escalation via Login Interception",
        description: "You have found the login page of a secure company portal, and a basic guest account with the credentials guest and guest is available. Although the login works, the account has limited privileges because the website checks the user’s account level in the background and blocks normal users from accessing restricted areas. The goal is to intercept the login request and modify it so the server believes you are an Admin, thereby gaining elevated access. website https://02xg1nlm-3000.inc1.devtunnels.ms/",
        points: 100,
        difficulty: "Easy",
        hash: "51d507a2c5ae977e4c83b798970553b168a0269b69460558a40baf7337d3140e",
        downloadLink: "/challenges/dragons_whisper.zip"
    },
    {
        title: "Wireshark Wizardry",
        description: "Intercept the network traffic and find the hidden flag in the packets. Someone has been sending secrets over unencrypted channels.",
        points: 150,
        difficulty: "Easy",
        hash: "fe68feb29ad249daa2cde24bf8a27c4ec7e535734911438117f48f3dd625e588",
        downloadLink: "/challenges/wireshark.pcap"
    },
    {
        title: "Log Hunter",
        description: "Analyze the server logs to find evidence of a breach and recover the flag. Metadata hidden in royal communications reveals the path.",
        points: 200,
        difficulty: "Medium",
        hash: "3fef69bcfcb227833fefd0277152bd9bee12cb87e9e2005a70d0813458e9bf68",
        downloadLink: "/challenges/access.log"
    },
    {
        title: "SQL Injection Master",
        description: "Bypass login or extract data from a vulnerable database using SQL injection. The flag hides within the ceremonial flames of the database.sql https://02xg1nlm-5000.inc1.devtunnels.ms/",
        points: 250,
        difficulty: "Medium",
        hash: "47242b6c44575b10b3abed6a4be1897b6cb8f12e224ed84a3d43721e212101b4",
        downloadLink: "/challenges/fire_and_smoke.zip"
    },
    {
        title: "The Polyglot Mystery",
        description: "This file is not what it seems. It acts like multiple formats. Find the hidden encoded secret within the dragon's vault.",
        points: 200,
        difficulty: "Medium",
        hash: "7725e826f37df182a8f1a1e7526a03408a4c0678c246192a4fc1344af554752e",
        downloadLink: "/challenges/Double Vision.jpg"
    },
    {
        title: "Port Voyager",
        description: "Enumerate all services on the target machine to find the open backdoor. The dragon's lair is full of open ports for the unwary.multi port service https://02xg1nlm-80.inc1.devtunnels.ms/",
        points: 300,
        difficulty: "Hard",
        hash: "19d476c578189bc976a92fd4ed3343e808de679ebce094f4e830fd016e5b3615",
        downloadLink: "/challenges/dragons_lair.zip"
    },
    {
        title: "OSINT Detective",
        description: "Use your OSINT skills to find and crack a hidden zip file. Find the identity of the keeper from their digital footprint. portfolio https://website-host-cloud.github.io/portfolio/",
        points: 150,
        difficulty: "Easy",
        hash: "1266bb94982de67c40fd5b85cb0a99bd1c46d6bd42144e1c1e7c7309cbd21795",
        downloadLink: "/challenges/OSINT to Unlock.zip"
    },
    {
        title: "Magic Bytes",
        description: "The file header is corrupted. Fix the magic bytes to see the content. Extract and analyze the core logic from the molten data.",
        points: 350,
        difficulty: "Hard",
        hash: "097563e8c7668d8e2f0f208a555256afc3ec249a216fd586a864d01e7b1395c5",
        downloadLink: "/challenges/challenge.jpg"
    },
    {
        title: "Disk Forensics Pro",
        description: "Recover a deleted flag from a disk image. Forensics challenge — recover deleted artifacts from the ashes of the filesystem.",
        points: 300,
        difficulty: "Hard",
        hash: "9e5bbdeeba472c9847c974bd28ef01cdadd2eac4f406937a03eb26c5fe48aa3f",
        downloadLink: "/challenges/Deep Excavation.dd.gz"
    },
    {
        title: "The Gatekeeper's Oversight",
        description: "Our lead developer left a testing portal active on the internal network. We’ve been told it’s secure because \"only the admin knows the secret URL,\" but we suspect the authentication is a bit... thin. Can you find a way to escalate your privileges and retrieve the flag?\n\nHint\nDon't just look at the page—look into it. The browser's View Source (Ctrl+U) reveals what the developer tried to hide.\n\nOnce you're inside, keep a close eye on the Address Bar. Sometimes, you can just tell the server who you want to be. gate keeper https://02xg1nlm-2304.inc1.devtunnels.ms/",
        points: 200,
        difficulty: "Medium",
        hash: "08ec29959c2506da7bc47696df7a857db0623043a69a03bba2e22453d5153e3b"
    },

];

export const ROUND2_CHALLENGES: Challenge[] = [
    { title: "The Night's Watch", description: "Breach the firewall of the Night's Watch. Find the vulnerability.", points: 150, difficulty: "Easy", hash: "c4d25e720f1cf89e7083f9fa764591033daae244ace2d6e27c50f5a94396b0c3" },
    { title: "White Walker", description: "A zombie process holds the key. Terminate it and claim the flag.", points: 200, difficulty: "Medium", hash: "c38cf52cbd6af009e3218622efa46380285bb761e18b889a06086ccf9068a860" },
    { title: "Iron Throne", description: "Escalate your privileges to sit on the Iron Throne.", points: 350, difficulty: "Hard", hash: "95bfb83edad1b73e4335f354efee56936fd0e3eeab86f0c05d66663d65feb763" },
    { title: "Winterfell Breach", description: "Exploit a buffer overflow in the castle defenses.", points: 300, difficulty: "Hard", hash: "690c4e3db5e014eb82acd0af454366a1f7db96c2afaa9c528be827e0a530c315" },
    { title: "Raven's Message", description: "Intercept and decode the encrypted raven message.", points: 200, difficulty: "Medium", hash: "c88fed9e4d231f0b67e1bc6fda37a1266ef9a5610812a368ff6fca9c3b7a46ce" },
    { title: "Stark's Secret", description: "Reverse engineer the Stark family's authentication mechanism.", points: 250, difficulty: "Medium", hash: "34bc4971211de392010910b83a1aeb328acc391a2ee1823fd24b91ee71242d97" },
    { title: "Wildfire", description: "A dangerous binary awaits. Defuse it to find the flag.", points: 400, difficulty: "Hard", hash: "ea1afbb3aca962cae6c8ca94d85c1aacca2f14ceeda93537c6651963309f6652" },
    { title: "The Wall", description: "Bypass the wall's defense mechanisms using exploitation techniques.", points: 300, difficulty: "Hard", hash: "3eda610bc28ec103799c8fd7b25231ac18f71d8c75446345b5bd2ba9e3e5784c" },
    { title: "King's Landing", description: "Navigate a complex network to reach the king's secrets.", points: 250, difficulty: "Medium", hash: "e6359364870adda1d27e5e0c58199cd4a517b25af85470b099d569978ce0b125" },
    { title: "Faceless Men", description: "Authentication bypass — become no one to access everything.", points: 350, difficulty: "Hard", hash: "70de9e9a13a7c4413b491d09e9a2ee84f3e5cd51e87ad4a4bfa6ccffebf6d40a" },
    { title: "Valar Morghulis", description: "The ultimate challenge. All men must die — all flags must fall.", points: 500, difficulty: "Hard", hash: "f75fb1f4e00fa181afcdb283b25f35f9da10349b542cd7ea47df082a82cdcb46" },
];

export const ALL_CHALLENGES = [...ROUND1_CHALLENGES, ...ROUND2_CHALLENGES];
export const ROUND1_TITLES = ROUND1_CHALLENGES.map(c => c.title);
export const ROUND2_TITLES = ROUND2_CHALLENGES.map(c => c.title);
