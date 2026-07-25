-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  author VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('published', 'draft')),
  published_at DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  views INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  image_url TEXT
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at);

-- Insert sample blog posts
INSERT INTO blog_posts (title, excerpt, content, author, category, status, published_at, views, tags, image_url)
VALUES 
(
  'The Future of AI in Business: Trends to Watch in 2024',
  'Explore the latest AI trends that are reshaping industries and discover how your business can stay ahead of the curve.',
  '<p>Artificial Intelligence continues to revolutionize how businesses operate across all sectors. From healthcare to finance, AI-powered solutions are enhancing efficiency, accuracy, and decision-making processes.</p><h2>Key AI Trends for 2024</h2><p>The landscape of AI is evolving rapidly, with several key trends emerging that will shape the future of business operations.</p><h3>1. Generative AI Integration</h3><p>Companies are increasingly adopting generative AI tools like ChatGPT and Midjourney to streamline content creation, customer service, and product development.</p><h3>2. AI-Powered Automation</h3><p>Businesses are leveraging AI to automate repetitive tasks, freeing up human workers to focus on more strategic initiatives.</p><h3>3. Enhanced Data Analytics</h3><p>AI-driven analytics tools are providing deeper insights into customer behavior, market trends, and operational efficiency.</p><h2>How to Stay Ahead</h2><p>To remain competitive in this AI-driven landscape, businesses should:</p><ul><li>Invest in AI training for employees</li><li>Start with pilot projects to test AI solutions</li><li>Partner with AI experts like 7Trendz Data</li><li>Stay updated on the latest AI developments</li></ul><p>At 7Trendz Data, we help businesses navigate the AI revolution with custom solutions tailored to your specific needs.</p>',
  'Dr. Sarah Johnson',
  'Artificial Intelligence',
  'published',
  '2024-12-15',
  1250,
  ARRAY['AI', 'Business', 'Technology', 'Trends', '2024'],
  '/placeholder.svg?height=600&width=1200&text=AI+Future'
),
(
  'Microsoft Copilot: Transforming Workplace Productivity',
  'Learn how Microsoft Copilot is revolutionizing the way teams collaborate and increasing productivity across organizations.',
  '<p>Microsoft Copilot represents a significant leap forward in workplace productivity tools. By integrating AI directly into Microsoft 365 applications, Copilot is changing how teams work, communicate, and collaborate.</p><h2>What is Microsoft Copilot?</h2><p>Microsoft Copilot is an AI-powered assistant that works seamlessly across Microsoft 365 apps including Word, Excel, PowerPoint, Outlook, and Teams. It uses large language models to understand context and provide intelligent assistance.</p><h2>Key Features</h2><h3>Document Creation</h3><p>Copilot can draft documents, create presentations, and generate content based on your prompts, saving hours of manual work.</p><h3>Data Analysis</h3><p>In Excel, Copilot can analyze complex datasets, create visualizations, and provide insights in natural language.</p><h3>Meeting Summaries</h3><p>Copilot can summarize Teams meetings, highlight action items, and even suggest follow-up tasks.</p><h2>Real-World Impact</h2><p>Organizations using Microsoft Copilot report:</p><ul><li>30% increase in productivity</li><li>Faster document creation</li><li>Improved collaboration</li><li>Better data-driven decision making</li></ul><p>7Trendz Data specializes in implementing and optimizing Microsoft Copilot for businesses of all sizes.</p>',
  'David Kim',
  'Microsoft Copilot',
  'published',
  '2024-12-10',
  890,
  ARRAY['Microsoft', 'Copilot', 'Productivity', 'Collaboration', 'AI'],
  '/placeholder.svg?height=600&width=1200&text=Microsoft+Copilot'
),
(
  'Data Science Best Practices for Small Businesses',
  'Practical tips and strategies for implementing data science solutions in small to medium-sized businesses.',
  '<p>Small businesses can leverage data science to gain competitive advantages without requiring massive budgets or large data teams. This guide provides practical strategies for getting started.</p><h2>Why Data Science Matters for Small Businesses</h2><p>Data science helps small businesses:</p><ul><li>Understand customer behavior</li><li>Optimize operations</li><li>Predict market trends</li><li>Make informed decisions</li><li>Compete with larger companies</li></ul><h2>Getting Started</h2><h3>1. Define Clear Objectives</h3><p>Start by identifying specific business problems you want to solve with data. Common objectives include improving customer retention, optimizing inventory, or identifying new market opportunities.</p><h3>2. Collect Quality Data</h3><p>Focus on collecting relevant, high-quality data from your operations. This might include:</p><ul><li>Customer purchase history</li><li>Website analytics</li><li>Social media engagement</li><li>Operational metrics</li></ul><h3>3. Start Small</h3><p>Begin with simple analytics projects before moving to complex machine learning models. Quick wins build momentum and demonstrate value.</p><h3>4. Use the Right Tools</h3><p>Modern data science tools are more accessible than ever:</p><ul><li>Google Analytics for web data</li><li>Power BI for visualization</li><li>Python/R for analysis</li><li>Cloud platforms for storage and processing</li></ul><h2>Common Pitfalls to Avoid</h2><p>Small businesses should avoid:</p><ul><li>Collecting data without a clear purpose</li><li>Ignoring data quality</li><li>Over-investing in tools before understanding needs</li><li>Trying to do everything at once</li></ul><h2>Partner with Experts</h2><p>7Trendz Data helps small businesses implement practical data science solutions that deliver real results. We focus on quick wins and scalable approaches that grow with your business.</p>',
  'Emily Rodriguez',
  'Data Science',
  'published',
  '2024-12-05',
  675,
  ARRAY['Data Science', 'Small Business', 'Analytics', 'Strategy', 'Best Practices'],
  '/placeholder.svg?height=600&width=1200&text=Data+Science'
);
