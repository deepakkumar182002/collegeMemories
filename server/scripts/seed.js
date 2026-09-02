import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env') });

import { connectDB, closeDB } from '../config/db.js';
import { Admin } from '../models/Admin.js';
import { Chapter } from '../models/Chapter.js';
import { Memory } from '../models/Memory.js';
import { Friend } from '../models/Friend.js';
import { Message } from '../models/Message.js';
import { Settings } from '../models/Settings.js';

export const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seed for College Memories / AlumniScraps...');
    await connectDB();

    // Clear existing data
    await Admin.deleteMany({});
    await Chapter.deleteMany({});
    await Memory.deleteMany({});
    await Friend.deleteMany({});
    await Message.deleteMany({});
    await Settings.deleteMany({});
    console.log('🧹 Cleaned existing database collections.');

    // 1. Create Default Admin
    const admin = await Admin.create({
      name: 'Batch Archivist',
      email: process.env.ADMIN_EMAIL || 'admin@alumniscraps.com',
      password: process.env.ADMIN_PASSWORD || 'Admin@12345',
      role: 'admin',
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
    });
    console.log(`👤 Admin created: ${admin.email} (Password: Admin@12345)`);

    // 2. Create Site Settings
    await Settings.create({
      siteName: 'AlumniScraps',
      collegeName: 'St. Xavier’s Institute of Technology',
      collegeLogo: '',
      heroTitle: 'Some places become memories. Some people become family.',
      heroSubtitle: 'A journey that started as strangers and ended with unforgettable memories.',
      heroDescription: 'Welcome to the interactive digital scrapbook of our college life. Scroll down to travel back in time.',
      heroImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1400&auto=format&fit=crop',
      primaryColor: '#570000',
      secondaryColor: '#565e77',
      accentColor: '#ffdf96',
      footerText: 'Crafted with nostalgia & love for the Class of 2020-2024. The story never really ends.',
      socialLinks: {
        instagram: 'https://instagram.com',
        linkedin: 'https://linkedin.com',
        youtube: 'https://youtube.com',
        website: '',
      },
      seoTitle: 'AlumniScraps - Interactive College Memory Book',
      seoDescription: 'A digital time-capsule scrapbook documenting 4 years of college life, canteen banter, late night study sessions, trips, and lifelong bonds.',
    });
    console.log('⚙️ Site settings initialized.');

    // 3. Create 13 Chapters
    const chaptersData = [
      {
        chapterNumber: 1,
        title: 'Where It All Began',
        shortDescription: 'The nervous smiles, the giant campus gates, and the realization that strangers were about to become our world.',
        fullDescription: 'Day one felt like stepping into an intimidating ocean. We were clutching our orientation brochures, looking for room numbers, and wondering who we would sit next to in our first lecture.',
        year: 'Year 1 - 2020',
        coverImage: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1200&auto=format&fit=crop',
        emoji: '🎒',
        icon: 'map-pin',
        accentColor: '#800000',
        layoutStyle: 'scrapbook-collage',
        displayOrder: 1,
      },
      {
        chapterNumber: 2,
        title: 'Strangers to Inseparables',
        shortDescription: 'Icebreakers turned into inside jokes. Suddenly, nobody had to eat lunch alone.',
        fullDescription: 'From awkward introductions in the quad to WhatsApp groups named "Tomorrow 9 AM Definitely", our bond formed quicker than we could imagine.',
        year: 'Year 1 - 2020',
        coverImage: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1200&auto=format&fit=crop',
        emoji: '🤝',
        icon: 'users',
        accentColor: '#5a627b',
        layoutStyle: 'polaroid-grid',
        displayOrder: 2,
      },
      {
        chapterNumber: 3,
        title: 'Classroom Chaos & Backbenches',
        shortDescription: 'Surprise attendance checks, backbench tic-tac-toe championships, and 5-minute pre-exam cramming.',
        fullDescription: 'The lecture halls witnessed more sleep-deprived laughter, passed handwritten notes, and last-minute assignment scrambles than actual syllabus coverage.',
        year: 'Year 2 - 2021',
        coverImage: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=1200&auto=format&fit=crop',
        emoji: '📚',
        icon: 'book-open',
        accentColor: '#4d3a00',
        layoutStyle: 'split-story',
        displayOrder: 3,
      },
      {
        chapterNumber: 4,
        title: 'Canteen Stories & Infinite Chai',
        shortDescription: 'The sacred canteen table where semester life problems were solved over cold coffee and samosas.',
        fullDescription: 'The canteen was our real classroom. Debates about professors, existential career panics, and sharing one plate of Maggi among six hungry people.',
        year: 'Year 2 - 2021',
        coverImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop',
        emoji: '☕',
        icon: 'coffee',
        accentColor: '#8f0f07',
        layoutStyle: 'sticky-wall',
        displayOrder: 4,
      },
      {
        chapterNumber: 5,
        title: 'Funny Moments & Bloopers',
        shortDescription: 'Unfiltered candid photos, terrible presentation slides, and moments that made us cry laughing.',
        fullDescription: 'The spontaneous goofiness that kept us sane through tough submission weeks. No filter, no posture, pure chaos.',
        year: 'Year 2 - 2022',
        coverImage: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=1200&auto=format&fit=crop',
        emoji: '😂',
        icon: 'smile',
        accentColor: '#c6a34d',
        layoutStyle: 'polaroid-grid',
        displayOrder: 5,
      },
      {
        chapterNumber: 6,
        title: 'Trips & Road Adventures',
        shortDescription: 'Packed cars, missed train stops, mountain bonfires, and sunrise talks that felt infinite.',
        fullDescription: 'The weekend getaways where we left textbooks behind and drove with windows down, blasting 2000s anthems under starry skies.',
        year: 'Year 3 - 2022',
        coverImage: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1200&auto=format&fit=crop',
        emoji: '🚗',
        icon: 'compass',
        accentColor: '#3e465e',
        layoutStyle: 'cinematic',
        displayOrder: 6,
      },
      {
        chapterNumber: 7,
        title: 'Festivals, Stage Lights & Chaos',
        shortDescription: 'Annual fest madness, acoustic night harmonies, backstage adrenaline, and neon lights.',
        fullDescription: 'Managing stage lights, hyping up college bands, dancing till 2 AM in the amphitheater with glowing wristbands.',
        year: 'Year 3 - 2023',
        coverImage: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200&auto=format&fit=crop',
        emoji: '🎉',
        icon: 'sparkles',
        accentColor: '#b22b1d',
        layoutStyle: 'scrapbook-collage',
        displayOrder: 7,
      },
      {
        chapterNumber: 8,
        title: 'Random Polaroids of Everyday Joy',
        shortDescription: 'The quiet in-between moments: campus cats, library sunsets, and rain showers on the verandah.',
        fullDescription: 'College was not just about the big milestones; it was the warmth of sitting on the quad grass while the sun dipped below the clocktower.',
        year: 'Year 3 - 2023',
        coverImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop',
        emoji: '📸',
        icon: 'camera',
        accentColor: '#565e77',
        layoutStyle: 'masonry',
        displayOrder: 8,
      },
      {
        chapterNumber: 9,
        title: 'The Motion Picture Vault',
        shortDescription: 'Live video reels capturing the sound of our cheers, canteen singalongs, and festival nights.',
        fullDescription: 'Photos freeze a moment, but videos bring back the sound of our laughter, the bad acoustic guitar strumming, and the echo of the quad.',
        year: 'Archive - All Years',
        coverImage: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1200&auto=format&fit=crop',
        emoji: '🎥',
        icon: 'video',
        accentColor: '#332500',
        layoutStyle: 'film-strip',
        displayOrder: 9,
      },
      {
        chapterNumber: 10,
        title: 'The Crew Who Made It Home',
        shortDescription: 'Our batchmates, mentors, and the crazy personalities who gave this campus its soul.',
        fullDescription: 'Every group had its unofficial titles: the attendance whisperer, the canteen minister, the last-minute slide designer, and the group mom.',
        year: 'Year 4 - 2024',
        coverImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop',
        emoji: '👥',
        icon: 'heart',
        accentColor: '#570000',
        layoutStyle: 'polaroid-grid',
        displayOrder: 10,
      },
      {
        chapterNumber: 11,
        title: 'Final Year & Major Projects',
        shortDescription: 'All-nighters in the lab, thesis defense panic, and realizing our days together were numbered.',
        fullDescription: 'Between bug fixes at 4 AM and final presentation practice, an unspoken nostalgia started creeping into every conversation.',
        year: 'Year 4 - 2024',
        coverImage: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1200&auto=format&fit=crop',
        emoji: '💻',
        icon: 'award',
        accentColor: '#800000',
        layoutStyle: 'split-story',
        displayOrder: 11,
      },
      {
        chapterNumber: 12,
        title: 'Farewell & The Last Bell',
        shortDescription: 'Sarees, blazers, autograph shirts, wet eyes, and tight hugs by the main entrance gate.',
        fullDescription: 'We dressed in our finest, scribbled wishes on each other’s lab coats, and realized that saying goodbye was the hardest test of all.',
        year: 'Year 4 - 2024',
        coverImage: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=1200&auto=format&fit=crop',
        emoji: '🎓',
        icon: 'flag',
        accentColor: '#565e77',
        layoutStyle: 'cinematic',
        displayOrder: 12,
      },
      {
        chapterNumber: 13,
        title: 'The Memory Box Stays Open',
        shortDescription: 'We left campus, but campus never left us. Forever connected, wherever life takes us.',
        fullDescription: 'Here’s to the friendships that will span decades, the memories that will bring a smile on cloudy days, and the golden years we got to share.',
        year: 'Forever',
        coverImage: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=1200&auto=format&fit=crop',
        emoji: '🌟',
        icon: 'star',
        accentColor: '#ffdf96',
        layoutStyle: 'fullscreen-image',
        displayOrder: 13,
      },
    ];

    const createdChapters = await Chapter.insertMany(chaptersData);
    console.log(`📖 Created ${createdChapters.length} Story Chapters.`);

    // 4. Create Rich Sample Memories
    const chMap = {};
    createdChapters.forEach((ch) => {
      chMap[ch.chapterNumber] = ch._id;
    });

    const memoriesData = [
      // Chapter 1
      {
        chapter: chMap[1],
        title: 'Campus Gates & First Steps',
        caption: 'First Day Jitters ✨',
        description: 'Standing under the grand arch with our bags full of fresh notebooks and heads full of curiosity.',
        memoryDate: 'August 18, 2020',
        year: '2020',
        mediaType: 'image',
        media: {
          url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=900&auto=format&fit=crop',
          thumbnail: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=400&auto=format&fit=crop',
        },
        emoji: '🏛️',
        location: 'Main Campus Arch',
        tags: ['Orientation', 'FirstDay', 'Campus'],
        people: ['Alex', 'Rohan', 'Sneha', 'Tanvi'],
        rotation: -3,
        layoutStyle: 'polaroid',
        displayOrder: 1,
        isFeatured: true,
      },
      {
        chapter: chMap[1],
        title: 'Orientation Day Starter Pack',
        caption: 'Room 302 vibe! ✌️',
        description: 'Lanyards, campus maps, library tokens, and that weird excitement of meeting our department advisors.',
        memoryDate: 'August 19, 2020',
        year: '2020',
        mediaType: 'image',
        media: {
          url: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=900&auto=format&fit=crop',
          thumbnail: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=400&auto=format&fit=crop',
        },
        emoji: '🎒',
        location: 'Orientation Hall B',
        tags: ['StarterPack', 'Orientation', 'DormLife'],
        people: ['Alex', 'Kunal'],
        rotation: 4,
        layoutStyle: 'sticky-note',
        displayOrder: 2,
        isFeatured: false,
      },
      {
        chapter: chMap[1],
        title: 'The Quad Sunshine Group',
        caption: 'Day 1 Quad Sit-in ☀️',
        description: 'We sat in a circle on the grass waiting for the second session to start and ended up chatting for hours.',
        memoryDate: 'August 20, 2020',
        year: '2020',
        mediaType: 'image',
        media: {
          url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=900&auto=format&fit=crop',
          thumbnail: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=400&auto=format&fit=crop',
        },
        emoji: '🌻',
        location: 'Central Lawn',
        tags: ['NewFriends', 'Quad', 'Sunlight'],
        people: ['Maya', 'Pooja', 'Vikram', 'Ananya'],
        rotation: -2,
        layoutStyle: 'polaroid',
        displayOrder: 3,
        isFeatured: true,
      },

      // Chapter 2
      {
        chapter: chMap[2],
        title: 'The Secret Table in the Lawn',
        caption: 'Our Unofficial HQ 🌳',
        description: 'That bench under the banyan tree that we claimed as our permanent headquarters.',
        memoryDate: 'September 12, 2020',
        year: '2020',
        mediaType: 'image',
        media: {
          url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=900&auto=format&fit=crop',
          thumbnail: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=400&auto=format&fit=crop',
        },
        emoji: '☕',
        location: 'Tree Bench 4',
        tags: ['Squad', 'HQ', 'Hangout'],
        people: ['Rohan', 'Sneha', 'Kabir', 'Dev'],
        rotation: 3,
        layoutStyle: 'polaroid',
        displayOrder: 1,
        isFeatured: true,
      },
      {
        chapter: chMap[2],
        title: 'Group Chat Was Born',
        caption: '“Don’t Tell Professor Sharma” 😂',
        description: 'Created at 2 AM to discuss syllabus, turned into a 24/7 meme distribution channel.',
        memoryDate: 'October 04, 2020',
        year: '2020',
        mediaType: 'text',
        media: { url: '', thumbnail: '' },
        emoji: '💬',
        location: 'Hostel Block 3',
        tags: ['Memes', 'GroupChat'],
        people: ['Entire Batch'],
        rotation: -4,
        layoutStyle: 'sticky-note',
        displayOrder: 2,
        isFeatured: false,
      },

      // Chapter 3
      {
        chapter: chMap[3],
        title: 'Physics Lab Disasters',
        caption: 'Oscilloscope went beep boop 💥',
        description: 'When nobody knew which wire went into channel 2, but the readings miraculously matched the theoretical curve.',
        memoryDate: 'February 14, 2021',
        year: '2021',
        mediaType: 'image',
        media: {
          url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=900&auto=format&fit=crop',
          thumbnail: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=400&auto=format&fit=crop',
        },
        emoji: '🔬',
        location: 'Lab Room 108',
        tags: ['Lab', 'Physics', 'Chaos'],
        people: ['Dev', 'Rohan', 'Tanvi'],
        rotation: 2,
        layoutStyle: 'notebook-card',
        displayOrder: 1,
        isFeatured: true,
      },
      {
        chapter: chMap[3],
        title: 'Backbench Masterminds',
        caption: 'Sleeping with eyes open 😴',
        description: 'A study in stealth: eating chips without making the plastic rustle during a 2-hour thermodynamics lecture.',
        memoryDate: 'March 22, 2021',
        year: '2021',
        mediaType: 'image',
        media: {
          url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=900&auto=format&fit=crop',
          thumbnail: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=400&auto=format&fit=crop',
        },
        emoji: '📝',
        location: 'Lecture Theatre 2',
        tags: ['Backbench', 'Lectures'],
        people: ['Alex', 'Kabir', 'Sneha'],
        rotation: -5,
        layoutStyle: 'polaroid',
        displayOrder: 2,
        isFeatured: false,
      },

      // Chapter 4
      {
        chapter: chMap[4],
        title: 'The Canteen Special Cold Coffee',
        caption: 'Fuel for Semester Survival ☕',
        description: 'Raju bhaiya knew everyone’s exact order without us ever uttering a single syllable.',
        memoryDate: 'August 10, 2021',
        year: '2021',
        mediaType: 'image',
        media: {
          url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=900&auto=format&fit=crop',
          thumbnail: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=400&auto=format&fit=crop',
        },
        emoji: '🍔',
        location: 'Central Canteen',
        tags: ['Canteen', 'Chai', 'Food'],
        people: ['All of us'],
        rotation: 3,
        layoutStyle: 'polaroid',
        displayOrder: 1,
        isFeatured: true,
      },
      {
        chapter: chMap[4],
        title: 'The Unofficial Debt Ledger',
        caption: '“I’ll GPay you bro” 💸',
        description: 'Hundreds of ₹20 samosa transactions pending forever in good faith.',
        memoryDate: 'November 15, 2021',
        year: '2021',
        mediaType: 'text',
        media: { url: '', thumbnail: '' },
        emoji: '🧾',
        location: 'Canteen Cashier',
        tags: ['Canteen', 'InsideJokes'],
        people: ['Kunal', 'Dev'],
        rotation: -2,
        layoutStyle: 'ticket',
        displayOrder: 2,
        isFeatured: false,
      },

      // Chapter 5
      {
        chapter: chMap[5],
        title: '3 AM Dorm Room Jam Session',
        caption: 'Terrible vocals, 10/10 vibes 🎸',
        description: 'A broken acoustic guitar, tapping on inverted plastic buckets, singing 90s rock with whole heart.',
        memoryDate: 'January 28, 2022',
        year: '2022',
        mediaType: 'image',
        media: {
          url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=900&auto=format&fit=crop',
          thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=400&auto=format&fit=crop',
        },
        emoji: '🎶',
        location: 'Room 404, Hostel A',
        tags: ['Jamming', 'Hostel', 'NightLife'],
        people: ['Vikram', 'Alex', 'Kabir'],
        rotation: 4,
        layoutStyle: 'polaroid',
        displayOrder: 1,
        isFeatured: true,
      },

      // Chapter 6
      {
        chapter: chMap[6],
        title: 'The Great Mountain Roadtrip',
        caption: 'Foggy hair & campfire songs 🌲',
        description: 'Hired two rusty hatchbacks and drove 400km into the misty hills over the long semester break.',
        memoryDate: 'April 08, 2022',
        year: '2022',
        mediaType: 'image',
        media: {
          url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=900&auto=format&fit=crop',
          thumbnail: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=400&auto=format&fit=crop',
        },
        emoji: '⛰️',
        location: 'Pine Ridge Valley',
        tags: ['Roadtrip', 'Adventure', 'Mountains'],
        people: ['Sneha', 'Rohan', 'Alex', 'Maya', 'Kabir'],
        rotation: -3,
        layoutStyle: 'postcard',
        displayOrder: 1,
        isFeatured: true,
      },

      // Chapter 7
      {
        chapter: chMap[7],
        title: 'Annual Cultural Fest - Neon Night',
        caption: 'The night we lost our voices 🎉',
        description: 'Backstage pass madness, neon confetti cannons, and jumping with 3,000 students under festival lights.',
        memoryDate: 'October 21, 2022',
        year: '2022',
        mediaType: 'image',
        media: {
          url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=900&auto=format&fit=crop',
          thumbnail: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=400&auto=format&fit=crop',
        },
        emoji: '🎆',
        location: 'Amphitheatre',
        tags: ['CollegeFest', 'Concert', 'Euphoria'],
        people: ['Entire Class'],
        rotation: 2,
        layoutStyle: 'polaroid',
        displayOrder: 1,
        isFeatured: true,
      },

      // Chapter 9 (Videos)
      {
        chapter: chMap[9],
        title: 'College Fest Aftermovie Reel',
        caption: 'Watch the madness in motion 🎬',
        description: 'Captured on a vintage camcorder during the opening night flashmob and festival finale.',
        memoryDate: 'November 02, 2022',
        year: '2022',
        mediaType: 'video',
        media: {
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
          thumbnail: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=900&auto=format&fit=crop',
          resourceType: 'video',
        },
        emoji: '🎥',
        location: 'Main Stage',
        tags: ['Video', 'Fest', 'Aftermovie'],
        people: ['Media Team'],
        rotation: 0,
        layoutStyle: 'film-frame',
        displayOrder: 1,
        isFeatured: true,
      },
      {
        chapter: chMap[9],
        title: 'Flashmob in the Quadrangle',
        caption: 'Surprise dance in between classes 💃',
        description: 'Over 100 students joined in synchronized rhythm right outside the central library.',
        memoryDate: 'December 10, 2022',
        year: '2022',
        mediaType: 'video',
        media: {
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=900&auto=format&fit=crop',
          resourceType: 'video',
        },
        emoji: '💃',
        location: 'Quadrangle',
        tags: ['Flashmob', 'Dance', 'Video'],
        people: ['Dance Club'],
        rotation: 0,
        layoutStyle: 'film-frame',
        displayOrder: 2,
        isFeatured: true,
      },

      // Chapter 11
      {
        chapter: chMap[11],
        title: 'Final Project Defense & Survival',
        caption: 'We actually finished it! 💻🎓',
        description: '48 straight hours of debugging, 17 cups of black coffee, and a slide deck that impressed the jury.',
        memoryDate: 'April 20, 2024',
        year: '2024',
        mediaType: 'image',
        media: {
          url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=900&auto=format&fit=crop',
          thumbnail: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=400&auto=format&fit=crop',
        },
        emoji: '🏆',
        location: 'Seminar Hall 1',
        tags: ['Capstone', 'Defense', 'Graduation'],
        people: ['Alex', 'Dev', 'Sneha', 'Tanvi'],
        rotation: -2,
        layoutStyle: 'notebook-card',
        displayOrder: 1,
        isFeatured: true,
      },

      // Chapter 12
      {
        chapter: chMap[12],
        title: 'The Convocation Day Photo',
        caption: 'Hats in the Air! 🎓✨',
        description: 'Tossing our black caps into the blue sky, feeling that strange mix of soaring freedom and aching nostalgia.',
        memoryDate: 'May 28, 2024',
        year: '2024',
        mediaType: 'image',
        media: {
          url: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=900&auto=format&fit=crop',
          thumbnail: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=400&auto=format&fit=crop',
        },
        emoji: '🎓',
        location: 'Convocation Grounds',
        tags: ['Graduation', 'ClassOf2024', 'Convocation'],
        people: ['Class of 2024'],
        rotation: 3,
        layoutStyle: 'polaroid',
        displayOrder: 1,
        isFeatured: true,
      },
      {
        chapter: chMap[12],
        title: 'Shirt Signing Ceremony',
        caption: 'Written in permanent marker, kept forever 🖊️',
        description: 'Scribbling messages on lab coats and white shirts: “Never change bro”, “Call me from Bangalore”, “Miss this always”.',
        memoryDate: 'May 29, 2024',
        year: '2024',
        mediaType: 'image',
        media: {
          url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=900&auto=format&fit=crop',
          thumbnail: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=400&auto=format&fit=crop',
        },
        emoji: '💌',
        location: 'Hostel Courtyard',
        tags: ['Farewell', 'Autographs'],
        people: ['Everyone'],
        rotation: -4,
        layoutStyle: 'polaroid',
        displayOrder: 2,
        isFeatured: true,
      },
    ];

    const createdMemories = await Memory.insertMany(memoriesData);
    console.log(`📸 Created ${createdMemories.length} Nostalgic Memories.`);

    // 5. Create Friends / College ID Cards
    const friendsData = [
      {
        name: 'Rohan Verma',
        nickname: 'The Canteen Minister 🍔',
        funTitle: 'Minister of Snacks & Bunking',
        shortDescription: 'Can tell you Raju bhaiya’s stock status from 500 meters away. Never attended a Friday 8 AM lecture.',
        favoriteMemory: 'Ordering 40 samosas for 5 people during midterms.',
        profileImage: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=600&auto=format&fit=crop',
        emoji: '🍔',
        batch: 'Computer Science 2024',
        idNumber: 'STX-20-CS-042',
        socialLinks: { instagram: 'https://instagram.com', linkedin: 'https://linkedin.com' },
        displayOrder: 1,
      },
      {
        name: 'Sneha Kulkarni',
        nickname: 'The Attendance Expert 😎',
        funTitle: '75.01% Calculation Grandmaster',
        shortDescription: 'Excel sheet formulas dedicated solely to maximizing allowed leaves while avoiding detention.',
        favoriteMemory: 'Signing proxy for 3 people in one single attendance roll call.',
        profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=600&auto=format&fit=crop',
        emoji: '📊',
        batch: 'Electronics 2024',
        idNumber: 'STX-20-EC-018',
        socialLinks: { instagram: 'https://instagram.com', linkedin: 'https://linkedin.com' },
        displayOrder: 2,
      },
      {
        name: 'Alex Chen',
        nickname: 'The Assignment Copier 😂',
        funTitle: 'Master of "Change it slightly so it doesn\'t look obvious"',
        shortDescription: 'Turns in assignments 3 minutes before the portal closes. Has 100+ GitHub tabs open at any moment.',
        favoriteMemory: 'Submitting a corrupted zip file to buy 2 extra days.',
        profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop',
        emoji: '💻',
        batch: 'Information Tech 2024',
        idNumber: 'STX-20-IT-009',
        socialLinks: { instagram: 'https://instagram.com', github: 'https://github.com' },
        displayOrder: 3,
      },
      {
        name: 'Maya Rao',
        nickname: 'The Silent Genius 🧠',
        funTitle: '“I didn’t study anything” -> Scores 9.8 CGPA',
        shortDescription: 'The one who saves the entire batch 2 hours before the semester exam with 3 handwritten summary pages.',
        favoriteMemory: 'Teaching 4 chapters of signals and systems in 45 minutes before exam.',
        profileImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=600&auto=format&fit=crop',
        emoji: '📚',
        batch: 'Computer Science 2024',
        idNumber: 'STX-20-CS-001',
        socialLinks: { instagram: 'https://instagram.com', linkedin: 'https://linkedin.com' },
        displayOrder: 4,
      },
      {
        name: 'Kabir Mehta',
        nickname: 'The Playlist Master 🎵',
        funTitle: 'Chief Auxiliary Cable Custodian',
        shortDescription: 'Has a playlist for every mood: road trip anthems, post-exam sighs, and late night 3 AM philosophy.',
        favoriteMemory: 'Blasting 2000s Bollywood at 2 AM in the hostel quad.',
        profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&auto=format&fit=crop',
        emoji: '🎧',
        batch: 'Mechanical Eng 2024',
        idNumber: 'STX-20-ME-055',
        socialLinks: { instagram: 'https://instagram.com', twitter: 'https://twitter.com' },
        displayOrder: 5,
      },
      {
        name: 'Tanvi Deshmukh',
        nickname: 'The Event Dictator 🎤',
        funTitle: 'Walkie-Talkie Overlord & Fest General',
        shortDescription: 'Carried the entire cultural festival on her shoulders while maintaining a glowing smile and 10,000 steps/day.',
        favoriteMemory: 'Getting permission for the DJ night 15 minutes before showtime.',
        profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop',
        emoji: '📣',
        batch: 'Civil Eng 2024',
        idNumber: 'STX-20-CE-012',
        socialLinks: { instagram: 'https://instagram.com', linkedin: 'https://linkedin.com' },
        displayOrder: 6,
      },
    ];

    const createdFriends = await Friend.insertMany(friendsData);
    console.log(`🪪 Created ${createdFriends.length} College ID Friend Profiles.`);

    // 6. Create Memory Wall Sticky Notes
    const messagesData = [
      {
        authorName: 'Tanvi',
        message: 'Still can’t believe we survived 8 semesters without getting kicked out of the library! Love you guys forever ❤️',
        emoji: '🥺',
        style: 'yellow',
        rotation: -3,
        displayOrder: 1,
      },
      {
        authorName: 'Rohan V.',
        message: 'Raju bhaiya’s canteen tea > Any Michelin star restaurant in the world. Change my mind.',
        emoji: '☕',
        style: 'pink',
        rotation: 4,
        displayOrder: 2,
      },
      {
        authorName: 'Dev & Alex',
        message: 'To the guys in Room 302: return my blue hoodie before our 10-year reunion!',
        emoji: '👕',
        style: 'blue',
        rotation: -5,
        displayOrder: 3,
      },
      {
        authorName: 'Sneha K.',
        message: 'No matter where in the world we land, we meet every December. Pinky promise 🤞✨',
        emoji: '🌟',
        style: 'purple',
        rotation: 2,
        displayOrder: 4,
      },
      {
        authorName: 'Kabir M.',
        message: 'The memories from the Himachal roadtrip will stay in my head until I’m 90 years old. Best 4 years of life.',
        emoji: '🚗',
        style: 'green',
        rotation: -2,
        displayOrder: 5,
      },
      {
        authorName: 'Maya R.',
        message: 'Thank you for giving me a home away from home. Class of 2024 always! 🎓❤️',
        emoji: '🏡',
        style: 'orange',
        rotation: 3,
        displayOrder: 6,
      },
    ];

    const createdMessages = await Message.insertMany(messagesData);
    console.log(`📌 Created ${createdMessages.length} Memory Wall Sticky Notes.`);

    console.log('🎉 Database seeding completed successfully!');
    if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
      await closeDB();
      process.exit(0);
    }
  } catch (error) {
    console.error('❌ Error during database seeding:', error);
    if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
      process.exit(1);
    }
  }
};

// If run directly
if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  seedDatabase();
}
