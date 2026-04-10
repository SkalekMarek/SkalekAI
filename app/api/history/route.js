export const dynamic = 'force-dynamic';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const getSupabaseAdmin = () => createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export async function GET(req) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { userId } = await auth();

    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data, error } = await supabaseAdmin
      .from('chats')
      .select('*')
      .eq('clerk_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error('History Fetch Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { userId } = await auth();
    const { chatId, title } = await req.json();

    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data, error } = await supabaseAdmin
      .from('chats')
      .update({ title, updated_at: new Date().toISOString() })
      .eq('id', chatId)
      .eq('clerk_id', userId)
      .select();

    if (error) throw error;
    return NextResponse.json(data[0]);
  } catch (error) {
    console.error('History Update Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { userId } = await auth();
    const { searchParams } = new URL(req.url);
    const chatId = searchParams.get('chatId');

    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { error } = await supabaseAdmin
      .from('chats')
      .delete()
      .eq('id', chatId)
      .eq('clerk_id', userId);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('History Delete Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
