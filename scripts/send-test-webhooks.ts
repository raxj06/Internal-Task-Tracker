import fetch from 'node-fetch';

// The URL you got from the n8n webhook node
const WEBHOOK_URL = process.argv[2];

if (!WEBHOOK_URL) {
    console.error("Please provide the webhook URL as an argument.");
    console.error("Usage: npx tsx scripts/send-test-webhooks.ts https://your-n8n.com/webhook-test/...");
    process.exit(1);
}

const testPayloads = [
    {
        name: "New Task Assigned",
        payload: {
            "type": "task_created",
            "task": {
                "id": "abc-123",
                "title": "[TEST] Prepare Monthly Slides",
                "description": "Needs to be done by Friday afternoon.",
                "priority": "High",
                "due_date": "2026-03-20T12:00:00.000Z"
            },
            "recipient": {
                "id": "xyz-789",
                "full_name": "Raj Vasoya",
                "email": "raj@example.com",
                "whatsapp_no": "+1234567890"
            },
            "sender": {
                "id": "mno-456",
                "full_name": "Test Manager"
            },
            "timestamp": new Date().toISOString()
        }
    },
    {
        name: "Task Reminder",
        payload: {
            "type": "task_reminder",
            "task": {
                "id": "abc-123",
                "title": "[TEST] Prepare Monthly Slides",
                "description": "Needs to be done by Friday afternoon.",
                "priority": "High",
                "status": "In Progress",
                "due_date": "2026-03-20T12:00:00.000Z"
            },
            "recipient": {
                "id": "xyz-789",
                "full_name": "Raj Vasoya",
                "email": "raj@example.com",
                "whatsapp_no": "+1234567890"
            },
            "timestamp": new Date().toISOString()
        }
    },
    {
        name: "Task Blocked",
        payload: {
            "type": "task_blocked",
            "task": {
                "id": "def-456",
                "title": "[TEST] Server Migration",
                "priority": "Critical",
                "due_date": "2026-03-15T12:00:00.000Z"
            },
            "recipient": {
                "id": "Manager-001",
                "full_name": "Head of Operations",
                "email": "manager@example.com",
                "whatsapp_no": "+1987654321"
            },
            "sender": {
                "id": "xyz-789",
                "full_name": "Raj Vasoya" // Person who blocked it
            },
            "timestamp": new Date().toISOString()
        }
    }
];

async function run() {
    console.log(`Sending ${testPayloads.length} test payloads to ${WEBHOOK_URL}...`);
    console.log("--------------------------------------------------");

    for (const test of testPayloads) {
        console.log(`Sending: ${test.name} (${test.payload.type})`);
        
        try {
            const response = await fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(test.payload)
            });

            if (response.ok) {
                console.log(`✅ Success! (${response.status})`);
            } else {
                console.error(`❌ Failed! HTTP ${response.status} - ${response.statusText}`);
                const text = await response.text();
                console.error(`   Response: ${text}`);
            }
        } catch (error) {
            console.error(`❌ Error throwing request:`, error);
        }
        
        console.log("--------------------------------------------------");
        // Wait 1 second between requests to let n8n UI breathe
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log("All tests finished! Check your n8n workflow executions.");
}

run();
