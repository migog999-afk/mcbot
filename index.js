const mineflayer = require('mineflayer');
const { pathfinder } = require('mineflayer-pathfinder');
const express = require('express');

// سيرفر ويب وهمي لإبقاء الاستضافة السحابية شغال 24/7
const app = express();
const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => res.send('Bot is active 24/7!'));
app.listen(PORT, () => console.log(`Web server running on port ${PORT}`));

function startBot() {
  const bot = mineflayer.createBot({
    host: 'minearchy.play.hosting',
    port: 25992,
    username: 'RealPlayerBot',
    version: '1.12.2'
  });

  bot.loadPlugin(pathfinder);

  bot.once('spawn', () => {
    console.log('✅ تم دخول البوت بنجاح!');

    // 1. تسجيل الدخول تلقائياً (Register / Login)
    setTimeout(() => {
      bot.chat('/register 20152015 20152015');
      bot.chat('/login 20152015');
    }, 3000);

    // 2. الحركة كل دقيقتين لمنع الخمول (خطوتين للأمام)
    setInterval(() => {
      console.log('🔄 تحريك البوت خطوتين للأمام...');
      bot.setControlState('forward', true);
      setTimeout(() => {
        bot.setControlState('forward', false);
      }, 1000);
    }, 120000);
  });

  // 3. العودة للحياة (Respawn) تلقائياً إذا مات
  bot.on('death', () => {
    console.log('💀 البوت مات، جاري عمل Respawn...');
    bot.emit('respawn');
  });

  // 4. الرد التلقائي إذا شخص قال "بوت" في الشات
  bot.on('chat', (username, message) => {
    if (username === bot.username) return;

    if (message.toLowerCase().includes('بوت')) {
      bot.chat(`انت البوت يا ${username}`);
    }
  });

  // 5. إعادة الاتصال التلقائي (Auto Reconnect)
  bot.on('end', (reason) => {
    console.log(`⚠️ انقطع الاتصال (${reason})، جاري إعادة المحاولة خلال 5 ثواني...`);
    setTimeout(startBot, 5000);
  });

  bot.on('error', (err) => {
    console.log('❌ خطأ في البوت:', err);
  });
}

startBot();
