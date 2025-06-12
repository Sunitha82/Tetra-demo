const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
    res.json({
        message: 'Tetragon Demo App is running!',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy' });
});

// Potentially suspicious endpoint for testing Tetragon policies
app.get('/test-security', (req, res) => {
    try {
        // This will trigger Tetragon monitoring for file access
        const info = {
            hostname: require('os').hostname(),
            platform: require('os').platform(),
            uptime: require('os').uptime()
        };
        res.json(info);
    } catch (error) {
        res.status(500).json({ error: 'Security test failed' });
    }
});

// Endpoint that demonstrates potential security concern (for testing)
app.get('/admin', (req, res) => {
    // This simulates accessing sensitive files that Tetragon should monitor
    res.json({ 
        message: 'Admin access - This should be monitored by Tetragon',
        warning: 'In production, this would be properly secured'
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Process ID: ${process.pid}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    process.exit(0);
});