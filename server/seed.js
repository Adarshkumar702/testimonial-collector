const mongoose = require('mongoose');
const User = require('./src/models/User');
const Space = require('./src/models/Space');
const Testimonial = require('./src/models/Testimonial');
const RefreshToken = require('./src/models/RefreshToken');
const { hashPassword } = require('./src/utils/password');
const env = require('./src/config/env');

const seedData = async () => {
  try {
    console.log('[Seed] Connecting to MongoDB...');
    await mongoose.connect(env.mongoUri);
    console.log('[Seed] Connected to database.');

    // Clear existing data
    await User.deleteMany({});
    await Space.deleteMany({});
    await Testimonial.deleteMany({});
    await RefreshToken.deleteMany({});
    console.log('[Seed] Cleared existing collections.');

    // Create Owner User
    const hashedPassword = await hashPassword('Password123!');
    const owner = await User.create({
      name: 'Sarah Connor',
      email: 'owner@example.com',
      password: hashedPassword,
      role: 'OWNER',
      isVerified: true
    });
    console.log(`[Seed] Created owner account: ${owner.email}`);

    // Create Demo Space
    const space = await Space.create({
      owner: owner._id,
      name: 'Acme Corporation',
      slug: 'acme-corp',
      prompt: 'How has Acme Corp helped your business grow? We would love your feedback!',
      requireAvatar: false,
      requireRating: true,
      customQuestions: [
        'What feature do you use the most?',
        'Would you recommend Acme Corp to a colleague?'
      ],
      isActive: true
    });
    console.log(`[Seed] Created demo space: ${space.name} (/collect/${space.slug})`);

    // Create Demo Testimonials
    const demoTestimonials = [
      {
        space: space._id,
        customerName: 'Alex Rivera',
        customerEmail: 'alex.rivera@techflow.io',
        companyRole: 'CTO at TechFlow',
        rating: 5,
        reviewText: 'Acme Corp transformed our entire workflow. The automation features saved us over 20 hours a week, and the customer support is top-notch!',
        customAnswers: [
          { question: 'What feature do you use the most?', answer: 'The automated report generator' },
          { question: 'Would you recommend Acme Corp to a colleague?', answer: 'Absolutely 100%' }
        ],
        status: 'approved',
        featured: true,
        liked: true,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      },
      {
        space: space._id,
        customerName: 'Elena Rostova',
        customerEmail: 'elena@designhub.co',
        companyRole: 'Lead Designer at DesignHub',
        rating: 5,
        reviewText: 'Incredible platform! Sleek design, lightning-fast performance, and our client response rate jumped by 40% after implementing their solution.',
        customAnswers: [
          { question: 'What feature do you use the most?', answer: 'Real-time collaborative analytics' },
          { question: 'Would you recommend Acme Corp to a colleague?', answer: 'Yes, already recommended to 3 teams.' }
        ],
        status: 'approved',
        featured: true,
        liked: true,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      },
      {
        space: space._id,
        customerName: 'Marcus Vance',
        customerEmail: 'marcus@growthkit.com',
        companyRole: 'VP of Marketing at GrowthKit',
        rating: 4,
        reviewText: 'Solid software with great ROI. Integration was smooth, and our team adapted within a single afternoon. Highly recommended!',
        customAnswers: [
          { question: 'What feature do you use the most?', answer: 'API Webhooks' },
          { question: 'Would you recommend Acme Corp to a colleague?', answer: 'Yes definitely' }
        ],
        status: 'approved',
        featured: false,
        liked: true,
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
      },
      {
        space: space._id,
        customerName: 'David Chen',
        customerEmail: 'david@cloudscale.net',
        companyRole: 'DevOps Lead at CloudScale',
        rating: 5,
        reviewText: 'The reliability is outstanding. Zero downtime in the last 6 months, and the documentation is crystal clear.',
        status: 'approved',
        featured: false,
        liked: false,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      },
      {
        space: space._id,
        customerName: 'Priya Sharma',
        customerEmail: 'priya@innovate.org',
        companyRole: 'Product Manager at InnovateOrg',
        rating: 5,
        reviewText: 'We collected over 50 verified customer reviews in our first week. Wall of Love embed looks stunning on our homepage!',
        status: 'approved',
        featured: true,
        liked: true,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        space: space._id,
        customerName: 'Samantha Reed',
        customerEmail: 'sam@brightmedia.com',
        companyRole: 'Founder at BrightMedia',
        rating: 4,
        reviewText: 'Great product overall. The dashboard is intuitive, and modulating reviews takes just a few clicks.',
        status: 'pending',
        featured: false,
        liked: false,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        space: space._id,
        customerName: 'Johnathan Miller',
        customerEmail: 'john@nexuscorp.com',
        companyRole: 'Operations Director at Nexus',
        rating: 3,
        reviewText: 'Good functionality, though we would love to see more customization options for mobile embed widgets in future updates.',
        status: 'pending',
        featured: false,
        liked: false,
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000)
      },
      {
        space: space._id,
        customerName: 'Anonymous Spam User',
        customerEmail: 'spam@botnet.test',
        companyRole: 'Marketer',
        rating: 1,
        reviewText: 'Buy cheap watches online at example-spam.com!!!',
        status: 'rejected',
        featured: false,
        liked: false,
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
      },
      {
        space: space._id,
        customerName: 'Old Customer',
        customerEmail: 'archive@legacy.com',
        companyRole: 'Former Client',
        rating: 2,
        reviewText: 'Outdated testimonial from 2023.',
        status: 'archived',
        featured: false,
        liked: false,
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      }
    ];

    await Testimonial.insertMany(demoTestimonials);
    console.log(`[Seed] Created ${demoTestimonials.length} demo testimonials.`);

    console.log('\n==================================================');
    console.log('SEED DATA CREATED SUCCESSFULLY!');
    console.log('==================================================');
    console.log('Demo Owner Email: owner@example.com');
    console.log('Demo Password   : Password123!');
    console.log('Demo Space Slug : acme-corp');
    console.log('Public Collection URL: http://localhost:5173/collect/acme-corp');
    console.log('Public Wall URL      : http://localhost:5173/wall/acme-corp');
    console.log('==================================================\n');

    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]', error);
    process.exit(1);
  }
};

seedData();
