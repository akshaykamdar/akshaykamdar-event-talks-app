// server.js
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Placeholder talk data
const talks = [
  {
    title: "The Future of Web Assembly",
    speakers: ["Alice Smith"],
    category: ["Web Development", "Performance"],
    duration: 60,
    description: "Exploring the exciting advancements and potential of Web Assembly for high-performance web applications."
  },
  {
    title: "Advanced CSS Techniques",
    speakers: ["Bob Johnson"],
    category: ["Frontend", "CSS", "Design"],
    duration: 60,
    description: "Dive deep into modern CSS features like Container Queries, Subgrid, and more."
  },
  {
    title: "State Management in React",
    speakers: ["Charlie Brown", "Dana White"],
    category: ["React", "Frontend", "JavaScript"],
    duration: 60,
    description: "A comprehensive look at various state management solutions in React, from Context API to Zustand."
  },
  {
    title: "Building Scalable Microservices with Node.js",
    speakers: ["Eve Davis"],
    category: ["Backend", "Node.js", "Microservices"],
    duration: 60,
    description: "Best practices and patterns for developing robust and scalable microservices using Node.js."
  },
  {
    title: "Introduction to Machine Learning on the Edge",
    speakers: ["Frank Green"],
    category: ["AI", "Machine Learning", "Edge Computing"],
    duration: 60,
    description: "An overview of running machine learning models on edge devices for real-time inference."
  },
  {
    title: "Security Best Practices for Web Applications",
    speakers: ["Grace Hall", "Heidi King"],
    category: ["Security", "Web Development"],
    duration: 60,
    description: "Protecting your web applications from common vulnerabilities and threats."
  }
];

// Function to inline CSS and JS into HTML
const inlineAssets = () => {
  let htmlContent = fs.readFileSync(path.join(__dirname, 'public', 'index.html'), 'utf8');
  const cssContent = fs.readFileSync(path.join(__dirname, 'public', 'style.css'), 'utf8');
  const jsContent = fs.readFileSync(path.join(__dirname, 'public', 'script.js'), 'utf8');

  htmlContent = htmlContent.replace('<!-- INLINE_CSS -->', `<style>${cssContent}</style>`);
  htmlContent = htmlContent.replace('<!-- INLINE_JS -->', `<script>${jsContent}</script>`);

  return htmlContent;
};

// API endpoint for talks
app.get('/api/talks', (req, res) => {
  res.json(talks);
});

// Serve the inlined HTML file
app.get('/', (req, res) => {
  res.send(inlineAssets());
});

// Optional: Generate static inlined index.html for direct serving
app.get('/generate-static-html', (req, res) => {
    const inlinedHtml = inlineAssets();
    fs.writeFileSync(path.join(__dirname, 'public', 'inlined_index.html'), inlinedHtml, 'utf8');
    res.send('inlined_index.html generated in the public directory.');
});


app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});