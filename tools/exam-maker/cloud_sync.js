// ============================================================
// cloud_sync.js — 作業中データ（左パネルの設定＋生成したテスト）を Supabase に自動保存
//
//  ・ログイン画面は無し。初回アクセス時にブラウザごとの「匿名ログイン」
//    (supabase.auth.signInAnonymously) を行い、そのセッションで本人の下書きだけを
//    読み書きする（他人の下書きはRLSで見えない・書けない）。
//  ・SUPABASE_URL / SUPABASE_ANON_KEY が空のままなら何もしない
//    （今まで通りlocalStorageのみで完結する。何も壊れない）。
//
//  導入手順：
//   1) math-labo-second 側で docs/supabase_setup_exam_maker.sql を実行
//   2) Supabase → Authentication → Providers → Anonymous Sign-Ins を ON
//   3) 下の SUPABASE_URL / SUPABASE_ANON_KEY を、
//      Supabase → Project Settings → API の値に書き換える
//      （anon/publishable key。RLSで保護されるので公開して問題ない値）
// ============================================================
(function () {
  const SUPABASE_URL = '';
  const SUPABASE_ANON_KEY = '';
  const SAVE_DEBOUNCE_MS = 1200;

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY || typeof window.supabase === 'undefined') {
    window.cloudSync = { ready: false, save() {}, load() { return Promise.resolve(null); } };
    return;
  }

  const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  let uidPromise = null;

  async function getUid() {
    if (!uidPromise) {
      uidPromise = (async () => {
        try {
          const { data: { session } } = await client.auth.getSession();
          if (session) return session.user.id;
          const { data, error } = await client.auth.signInAnonymously();
          if (error) { console.warn('[cloudSync] 匿名ログインに失敗:', error.message); return null; }
          return data.user.id;
        } catch (e) {
          console.warn('[cloudSync] 匿名ログインに失敗:', e);
          return null;
        }
      })();
    }
    return uidPromise;
  }

  let saveTimer = null;
  function save(payload) {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(async () => {
      const uid = await getUid();
      if (!uid) return;
      try {
        await client.from('exam_maker_drafts')
          .upsert({ id: uid, data: payload, updated_at: new Date().toISOString() });
      } catch (e) {
        console.warn('[cloudSync] 保存に失敗:', e);
      }
    }, SAVE_DEBOUNCE_MS);
  }

  async function load() {
    const uid = await getUid();
    if (!uid) return null;
    try {
      const { data, error } = await client.from('exam_maker_drafts')
        .select('data').eq('id', uid).maybeSingle();
      if (error || !data) return null;
      return data.data || null;
    } catch (e) {
      console.warn('[cloudSync] 読み込みに失敗:', e);
      return null;
    }
  }

  window.cloudSync = { ready: true, save, load };
})();
