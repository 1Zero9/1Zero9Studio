import { NextRequest, NextResponse } from 'next/server'

// Smart responses based on detected keywords and context
const RESPONSES = {
  greeting: [
    "Hi! I'm Nova from 1Zero9 Studio. 🚀 Tell me about your business and vision - I'll recommend the perfect website solution tailored to your goals. We specialize in turning ideas into stunning digital experiences. What are you looking to build?",
    "Welcome to 1Zero9 Studio! I'm Nova, your AI consultant. Whether you need to sell products, showcase creative work, or establish your brand - we'll design the perfect site for you. Our team combines cutting-edge tech with award-winning design. What's your vision?",
    "Hey there! I'm Nova from 1Zero9 Studio. Not sure which website type fits your business? That's exactly what we're here for! Share your goals and I'll match you with the ideal solution from our proven templates. Let's build something amazing together!",
  ],
  portfolio: [
    "Brilliant! I've matched you with our **Premium Portfolio** package. ✨ **I've auto-selected it below.** At 1Zero9 Studio, we create portfolio sites that land clients - not just show work. You'll get: stunning galleries, animated case studies, client testimonials, and mobile-first responsive design. Our portfolios average 3x more client inquiries than standard sites. Ready to see what we can build?",
    "Perfect match! A **Portfolio** site is exactly what you need - **selected for you below!** 🎨 Our team at 1Zero9 Studio specializes in portfolio sites that convert. Features include: high-res image optimization, fast loading speeds, SEO-ready structure, and integrated contact forms. We've helped photographers, designers, and creatives triple their leads. Check the selection below!",
    "Excellent! Based on your needs, I've chosen our **Portfolio Solution** - **see below!** ✨ This isn't just a gallery - it's your personal brand headquarters. You'll get: project showcases with before/after, client testimonial widgets, downloadable PDFs, and analytics dashboard. 1Zero9 builds portfolios that do the selling for you. Ready to stand out?",
  ],
  store: [
    "Perfect! You need our **E-Commerce Powerhouse** package. 🛍️ **I've auto-selected it below!** At 1Zero9 Studio, we don't just build stores - we build revenue engines. Includes: product catalogs with smart search, secure checkout, inventory management, abandoned cart recovery, and sales analytics. Our stores average 40% higher conversion rates. Ready to start making money?",
    "Brilliant! An **Online Store** is your perfect match - **selected below!** 💰 We've built e-commerce sites that process millions in sales. You'll get: mobile-optimized shopping, multiple payment gateways, shipping integrations, customer accounts, promotional tools, and 24/7 security. 1Zero9's e-commerce sites are built to sell from day one. Let's get you profitable!",
    "Excellent! I've chosen our **Store Builder** for you - **check below!** 🚀 This is enterprise-level e-commerce made simple. Features include: unlimited products, automated tax calculation, discount codes, review systems, and marketing integrations. We handle the tech - you focus on selling. Our clients see sales within the first week. Ready to launch?",
  ],
  blog: [
    "Perfect! Our **Content Publishing Platform** is ideal for you. 📝 **I've selected it below!** At 1Zero9 Studio, we build blogs that rank on Google and grow audiences. Includes: SEO optimization, social media integration, email newsletter signup, content scheduling, and analytics. Our blog sites get 5x more traffic than DIY solutions. Ready to build your audience?",
    "Brilliant! A **Blog** site is your match - **auto-selected below!** ✍️ We create content platforms that turn readers into followers. Features: fast loading for SEO, mobile-optimized reading, social sharing buttons, comment moderation, and RSS feeds. 1Zero9's blogs are designed to grow organically. Our clients average 200+ subscribers in month one. Ready to start publishing?",
    "Excellent! I've chosen our **Publishing Suite** for you - **see below!** 📚 This isn't just a blog - it's your authority-building machine. You'll get: category/tag organization, featured posts, author bios, related articles, and newsletter integration. We've helped bloggers monetize their content and build 6-figure audiences. Ready to share your voice?",
  ],
  business: [
    "Perfect! You need our **Professional Business Package**. 🏢 **I've selected it below!** At 1Zero9 Studio, we build sites that close deals. Includes: services showcase, team profiles with bios, client testimonial sliders, portfolio integration, contact forms with CRM, and booking calendars. Our business sites generate 60% more qualified leads. Ready to grow your business?",
    "Brilliant! A **Business** site is exactly what you need - **auto-selected below!** 💼 We specialize in professional sites that establish authority. Features: about us storytelling, service pages with pricing, case studies, team showcase, office locations map, and client logos. 1Zero9's business sites position you as the premium choice. Ready to dominate your market?",
    "Excellent! I've chosen our **Corporate Solution** - **check below!** 🎯 This is more than a website - it's your 24/7 sales team. You'll get: services catalog, team directory, project gallery, client testimonials, contact forms, and live chat integration. We've helped agencies and consultants 2x their client base. Ready to scale?",
  ],
  landing: [
    "Perfect! Our **High-Converting Landing Page** is your answer. 🎯 **I've selected it below!** At 1Zero9 Studio, we create landing pages that convert at 25%+ (industry average is 2-5%). Includes: attention-grabbing hero, benefit-focused copy, trust signals, lead capture forms, and A/B testing setup. Our landing pages have generated millions in revenue for clients. Ready to launch your campaign?",
    "Brilliant! A **Landing Page** is exactly what you need - **auto-selected below!** 🚀 We build single-page sites designed to convert traffic into customers. Features: scroll-triggered animations, social proof sections, video backgrounds, countdown timers, and conversion tracking. 1Zero9's landing pages outperform competitors 5-to-1. Ready to maximize ROI?",
    "Excellent! I've chosen our **Conversion-Focused Landing Page** - **see below!** 💥 This is laser-focused on one goal: getting conversions. You'll get: mobile-first design, fast loading (<2s), clear CTAs, benefit showcases, and email capture. We've helped launches exceed funding goals by 300%. Ready to make an impact?",
  ],
  clarification: [
    "Interesting! I want to make sure we build exactly what you need. Are you looking to sell products, showcase your work, publish content, or establish your business online? At 1Zero9 Studio, we have proven solutions for every goal. Tell me more about your vision!",
    "I want to match you with the perfect solution! 🎯 What's your main goal? Whether it's generating sales, attracting clients, building an audience, or establishing authority - we've helped hundreds of businesses succeed. Share more details so I can recommend the ideal package!",
    "Let's find your perfect match! Are you looking to: **sell products online** (e-commerce), **showcase creative work** (portfolio), **share expertise** (blog), **promote services** (business site), or **launch a campaign** (landing page)? 1Zero9 Studio specializes in all of these - tell me which sounds closest!",
  ],
  encouragement: [
    "Excellent! I've helped you select the perfect site type. 👇 **Check the options below** to confirm your selection. At 1Zero9 Studio, we've helped over 300 businesses launch with these proven templates. Click Next when you're ready to customize your design and make it uniquely yours!",
    "Perfect! You're on the right track. 🚀 **Your site type is selected below** - this package has generated millions in revenue for our clients. Ready to customize it? Click Next to choose your design style, colors, and features. We'll show you exactly what your site will look like!",
    "Great choice! ✅ **Confirm your selection below**, then hit Next to continue building. This is where it gets exciting - you'll pick stunning designs, professional color schemes, and premium features. 1Zero9 Studio makes it easy to create a website that converts visitors into customers. Let's keep going!",
  ],
}

function detectSiteType(text: string): string | null {
  const lowerText = text.toLowerCase()

  if (/(portfolio|showcase|work|design|photo|creative|artist|freelanc|gallery)/i.test(lowerText)) {
    return 'portfolio'
  }
  if (/(shop|store|sell|product|ecommerce|buy|retail|inventory|cart)/i.test(lowerText)) {
    return 'store'
  }
  if (/(blog|write|article|content|post|publish|journal|author)/i.test(lowerText)) {
    return 'blog'
  }
  if (/(business|company|agency|service|professional|consult|corporate|firm)/i.test(lowerText)) {
    return 'business'
  }
  if (/(landing|launch|campaign|event|promote|single page|conversion)/i.test(lowerText)) {
    return 'landing'
  }

  return null
}

function getRandomResponse(responses: string[]): string {
  return responses[Math.floor(Math.random() * responses.length)]
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { messages, siteType } = body

    // Validate input
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array required' },
        { status: 400 }
      )
    }

    // Get the last user message
    const lastUserMessage = messages[messages.length - 1]?.content || ''

    // Count how many messages in the conversation
    const userMessages = messages.filter((m: any) => m.role === 'user')
    const conversationLength = userMessages.length

    // Get all previous Nova responses to avoid repetition
    const previousResponses = messages
      .filter((m: any) => m.role === 'agent')
      .map((m: any) => m.content)

    // Detect site type from user's message
    let detectedSiteType = null
    if (!siteType) {
      detectedSiteType = detectSiteType(lastUserMessage)
    }

    // Generate smart response
    let response = ''

    if (lastUserMessage.trim().length < 3) {
      // Too short
      response = getRandomResponse(RESPONSES.clarification)
    } else if (detectedSiteType && !siteType) {
      // Detected a new site type! Ask the first follow-up question
      const options = RESPONSES[detectedSiteType as keyof typeof RESPONSES]
      // Pick the first one that hasn't been used
      response = options.find(r => !previousResponses.includes(r)) || options[0]
    } else if (siteType) {
      // Already have a site type selected
      if (conversationLength === 2) {
        // Second message - ask one more follow-up if we have unused questions
        const options = RESPONSES[siteType as keyof typeof RESPONSES]
        const unusedQuestion = options.find(r => !previousResponses.includes(r))
        response = unusedQuestion || getRandomResponse(RESPONSES.encouragement)
      } else {
        // After second message, just give encouragement
        const encouragements = RESPONSES.encouragement.filter(r => !previousResponses.includes(r))
        response = encouragements.length > 0
          ? encouragements[Math.floor(Math.random() * encouragements.length)]
          : "Great! Feel free to select your site type below when you're ready to continue."
      }
    } else {
      // No site type detected yet
      const encouragements = RESPONSES.encouragement.filter(r => !previousResponses.includes(r))
      response = encouragements.length > 0
        ? getRandomResponse(encouragements)
        : getRandomResponse(RESPONSES.encouragement)
    }

    return NextResponse.json({
      response,
      siteType: detectedSiteType,
    })

  } catch (error: any) {
    console.error('API error:', error)

    return NextResponse.json({
      response: getRandomResponse(RESPONSES.greeting),
      siteType: null,
    })
  }
}
