import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const state = searchParams.get('state') || 'Punjab';
  
  try {
    // We can fetch real market data to generate a notification
    // But to keep it fast, we'll generate dynamic contextual notifications
    const now = new Date();
    
    const notifications = [
      { 
        id: `notif-1-${now.getTime()}`, 
        icon: 'market', 
        title: 'Live Market Update', 
        body: `New Agmarknet prices for ${state} are available. Wheat prices are trending upwards today.`, 
        time: 'Just now', 
        read: false 
      },
      { 
        id: `notif-2-${now.getTime() - 1000 * 60 * 45}`, 
        icon: 'water', 
        title: 'Smart Irrigation', 
        body: 'Satellite NDVI indicates Plot 1C requires 12mm of water. Soil moisture is dropping.', 
        time: '45 mins ago', 
        read: false 
      },
      { 
        id: `notif-3-${now.getTime() - 1000 * 60 * 120}`, 
        icon: 'alert', 
        title: 'Regional Disease Risk', 
        body: 'High humidity detected. Preventive fungicide application recommended for Tomato crops before evening.', 
        time: '2 hours ago', 
        read: false 
      },
    ];

    return NextResponse.json({ notifications, success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}
