import { NextRequest, NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'
import { BuilderState } from '@/types/builder'
import { sendBothEmails } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const state: BuilderState = body.state

    // Validate required fields
    if (!state.contactInfo.email || !state.contactInfo.name) {
      return NextResponse.json(
        { error: 'Missing required contact information' },
        { status: 400 }
      )
    }

    if (!state.siteType || !state.designStyle) {
      return NextResponse.json(
        { error: 'Missing required design selections' },
        { status: 400 }
      )
    }

    if (!state.userContent.businessName || !state.userContent.tagline) {
      return NextResponse.json(
        { error: 'Missing required business information' },
        { status: 400 }
      )
    }

    // Check if Supabase is configured
    const hasSupabase = process.env.SUPABASE_SERVICE_ROLE_KEY &&
                        process.env.NEXT_PUBLIC_SUPABASE_URL &&
                        !process.env.SUPABASE_SERVICE_ROLE_KEY.includes('your-service-role-key')

    let savedData = null

    if (hasSupabase) {
      // Get server-side Supabase client
      const supabase = getServiceSupabase()

      // Prepare data for insertion
      const designData = {
      // Contact information
      user_email: state.contactInfo.email,
      user_name: state.contactInfo.name,
      user_phone: state.contactInfo.phone || null,
      preferred_contact: state.contactInfo.preferredContact || 'email',
      additional_notes: state.contactInfo.notes || null,

      // Site type and purpose
      site_type: state.siteType,
      purpose_description: state.purposeDescription || null,

      // Design choices
      design_style: state.designStyle,
      color_scheme: state.colorScheme,
      typography: state.typography,

      // Selected sections
      selected_sections: state.selectedSections,

      // User content
      business_name: state.userContent.businessName,
      tagline: state.userContent.tagline,
      logo: state.userContent.logo || null,
      primary_color: state.userContent.primaryColor || null,
      email: state.userContent.email || null,
      phone: state.userContent.phone || null,
      social_links: state.userContent.socialLinks || {},

      // Metadata
      status: 'pending',
      session_id: state.sessionId || null,

      // Full state backup
      full_state: state,
    }

      // Insert into Supabase
      const { data, error } = await supabase
        .from('saved_designs')
        .insert(designData)
        .select()
        .single()

      if (error) {
        console.error('Supabase error:', error)
        return NextResponse.json(
          { error: 'Failed to save design to database', details: error.message },
          { status: 500 }
        )
      }

      savedData = data
    } else {
      // Supabase not configured - just generate a mock ID and log the data
      console.log('⚠️  Supabase not configured - submission data:')
      console.log(JSON.stringify(state, null, 2))

      savedData = {
        id: `mock-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      }

      console.log('✅ Mock submission successful with ID:', savedData.id)
    }

    // Send emails (don't wait for them - send in background)
    // Using Promise.allSettled so email failures don't break the submission
    const hasResend = process.env.RESEND_API_KEY &&
                      !process.env.RESEND_API_KEY.includes('your_api_key')

    if (hasResend) {
      sendBothEmails(state, savedData.id).then(emailResults => {
        console.log('Email results:', emailResults)
      }).catch(err => {
        console.error('Email sending failed (non-critical):', err)
      })
    } else {
      console.log('⚠️  Resend not configured - skipping email notifications')
    }

    // Return success with the created record ID
    return NextResponse.json({
      success: true,
      id: savedData.id,
      message: hasSupabase ? 'Design saved successfully' : 'Design received (demo mode - Supabase not configured)',
    })

  } catch (error: any) {
    console.error('Error in save-design API:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

// Optional: GET endpoint to retrieve a design by ID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Design ID required' },
        { status: 400 }
      )
    }

    const supabase = getServiceSupabase()

    const { data, error } = await supabase
      .from('saved_designs')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Design not found', details: error.message },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      design: data,
    })

  } catch (error: any) {
    console.error('Error in GET save-design API:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}
