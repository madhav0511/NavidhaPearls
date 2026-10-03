import type { IncomingMessage, ServerResponse } from 'http';

interface AiSensyRequestBody {
  userName: string;
  phone: string;
  message?: string;
  inquiryType?: string;
  source?: string;
  tags?: string[];
  attributes?: Record<string, any>;
}

export async function handleAiSensyApiRoute(req: IncomingMessage, res: ServerResponse): Promise<boolean> {
  const url = req.url || '';

  // GET /api/aisensy/status
  if (url === '/api/aisensy/status' && req.method === 'GET') {
    const apiKey = process.env.AISENSY_API_KEY || process.env.VITE_AISENSY_API_KEY || '';
    const campaignName = process.env.AISENSY_CAMPAIGN_NAME || 'navidha_website_lead';
    const businessNumber = process.env.AISENSY_BUSINESS_NUMBER || '918985133732';

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        isConfigured: !!apiKey,
        campaignName,
        businessNumber,
        provider: 'AiSensy WhatsApp Business API',
      })
    );
    return true;
  }

  // POST /api/aisensy/lead
  if (url === '/api/aisensy/lead' && req.method === 'POST') {
    let bodyText = '';
    req.on('data', (chunk) => {
      bodyText += chunk;
    });

    req.on('end', async () => {
      try {
        const body: AiSensyRequestBody = JSON.parse(bodyText || '{}');
        const apiKey = process.env.AISENSY_API_KEY || process.env.VITE_AISENSY_API_KEY || '';
        const campaignName = process.env.AISENSY_CAMPAIGN_NAME || 'navidha_website_lead';

        let destination = (body.phone || '').replace(/[^0-9]/g, '');
        if (destination.length === 10) destination = '91' + destination;
        if (!destination.startsWith('+')) destination = '+' + destination;

        const userName = body.userName || 'Guest Client';
        const inquiryType = body.inquiryType || 'Custom Commission';
        const userMessage = body.message || 'General jewelry inquiry from website floater';

        console.log('[AiSensy API] Processing lead for WhatsApp:', destination, 'Name:', userName);

        // If API key is provided, execute the live AiSensy API call
        if (apiKey) {
          const aisensyPayload = {
            apiKey,
            campaignName,
            destination,
            userName,
            source: body.source || 'Navidha Website WhatsApp Floater',
            templateParams: [userName, inquiryType],
            tags: body.tags || ['Website Lead', 'WhatsApp Floater', inquiryType],
            attributes: {
              inquiry_type: inquiryType,
              customer_message: userMessage,
              submission_time: new Date().toISOString(),
              ...(body.attributes || {}),
            },
          };

          const aisensyRes = await fetch('https://backend.aisensy.com/campaign/t1/api/v2', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(aisensyPayload),
          });

          const aisensyData = await aisensyRes.json().catch(() => ({}));
          console.log('[AiSensy API] Live response status:', aisensyRes.status, aisensyData);

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(
            JSON.stringify({
              success: aisensyRes.ok,
              status: aisensyRes.ok ? 'delivered' : 'api_error',
              message: aisensyRes.ok ? 'Lead transmitted to AiSensy campaign' : 'AiSensy rejected payload',
              aisensyResponse: aisensyData,
            })
          );
          return;
        }

        // Mock/Simulated success mode when API key is not yet set in environment
        console.log('[AiSensy API] No AISENSY_API_KEY configured yet. Simulating successful broadcast.');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({
            success: true,
            status: 'simulated',
            message: 'AiSensy lead captured in simulation mode. Add AISENSY_API_KEY to .env for live dispatch.',
            data: {
              destination,
              userName,
              campaignName,
            },
          })
        );
      } catch (err: any) {
        console.error('[AiSensy API] Error handling request:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message || 'Server error' }));
      }
    });

    return true;
  }

  return false;
}
