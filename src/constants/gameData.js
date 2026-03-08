export const GAME_PHASES = {
  MENU: "MENU",
  SETUP: "SETUP",
  ROLE_REVEAL: "ROLE_REVEAL",
  NIGHT_SCAMMER: "NIGHT_SCAMMER",
  NIGHT_ADMIN: "NIGHT_ADMIN",
  DAY_INVESTIGATION: "DAY_INVESTIGATION",
  VOTING: "VOTING",
  RESULT: "RESULT",
  QUIZ: "QUIZ",
};

export const ROLES = {
  ADMIN: "ADMIN",
  SCAMMER: "SCAMMER",
  USER: "USER",
};

// Asset paths (imported via Vite's static asset handling)
export const ASSETS = {
  logo: new URL("../assets/logo.png", import.meta.url).href,
  background: new URL("../assets/background.png", import.meta.url).href,
  rules: new URL("../assets/rule.png", import.meta.url).href,
  ifogame: new URL("../assets/ifogame.jpg", import.meta.url).href,
  token: new URL("../assets/token.png", import.meta.url).href,
  backCover: new URL("../assets/back_cover_card.png", import.meta.url).href,
  sounds: {
    main: new URL("../assets/sound/mainsound.mp3", import.meta.url).href,
    game: new URL("../assets/sound/gamesound.mp3", import.meta.url).href,
    click: new URL("../assets/sound/clik.mp3", import.meta.url).href,
    win: new URL("../assets/sound/win.mp3", import.meta.url).href,
    lost: new URL("../assets/sound/lost.mp3", import.meta.url).href,
    incorrect: new URL("../assets/sound/incorrect.mp3", import.meta.url).href,
    correct: new URL("../assets/sound/correct.mp3", import.meta.url).href,
  },
  roles: {
    ADMIN: new URL("../assets/role/admin.png", import.meta.url).href,
    SCAMMER: [
      new URL("../assets/role/scammer1.png", import.meta.url).href,
      new URL("../assets/role/scammer2.png", import.meta.url).href,
    ],
    USER: [
      new URL("../assets/role/user1.png", import.meta.url).href,
      new URL("../assets/role/user2.png", import.meta.url).href,
      new URL("../assets/role/user3.png", import.meta.url).href,
      new URL("../assets/role/user4.png", import.meta.url).href,
      new URL("../assets/role/user5.png", import.meta.url).href,
    ],
  },
  test: {
    scammer: new URL("../assets/test/scamer.png", import.meta.url).href,
    hacker: new URL("../assets/test/hacker.png", import.meta.url).href,
  },
};

// Defense cards mapped to def/*.png
export const DEFENSE_CARDS = [
  {
    id: "D1",
    name: "ตรวจสอบข้อมูลหลายแหล่ง",
    image: new URL("../assets/def/ตรวจสอบข้อมูลหลายแหล่ง.png", import.meta.url)
      .href,
    description:
      "การยืนยันข้อมูลจากแหล่งที่มาอื่น ๆ เช่น ข่าวสำนักใหญ่ ประกาศจากภาครัฐ หรือแหล่งอ้างอิงที่เชื่อถือได้",
    example:
      "มีข้อความส่งมาว่าคุณได้รางวัลใหญ่ ให้โอนเงินค่าภาษี คุณจึงค้นหาข้อมูลอของสำนักงานจากหลาย ๆ แหล่งเพื่อไม่ให้โดนข่าวปลอมหลอกได้",
  },
  {
    id: "D2",
    name: "ตรวจสอบเบอร์โทร",
    image: new URL("../assets/def/ตรวจสอบเบอร์โทร.png", import.meta.url).href,
    description:
      "ค้นหาเบอร์โทรแปลกปลอมบนอินเทอร์เน็ต หรือใช้งานแอปพลิเคชันอย่าง Whoscall เพื่อระบุความเสี่ยง",
    example:
      "มีสายเรียกเข้าบอกว่าเป็นเจ้าหน้าที่ตำรวจ คุณจึงนำเบอร์นั้นไปค้นหาใน Google พบว่ามีรายงานคนถูกหลอกด้วยเบอร์นี้เต็มไปหมด",
  },
  {
    id: "D3",
    name: "รายงาน",
    image: new URL("../assets/def/รายงาน.png", import.meta.url).href,
    description:
      "แจ้งความหรือ Report ไปยังแพลตฟอร์ม โซเชียลมีเดีย เว็บไซต์ หรือหน่วยงานที่รับผิดชอบเพื่อบล็อกเนื้อหาหรือบัญชีนั้นๆ",
    example:
      "เพื่อนทักมายืมเงินทาง Facebook พร้อมลิงก์แปลก ๆ คุณรู้ว่าเพื่อนถูกแฮ็ก คุณจึงกดปุ่ม Report บัญชีนั้นให้ทาง Facebook ตรวจสอบ",
  },
  {
    id: "D4",
    name: "อัพเดตระบบ",
    image: new URL("../assets/def/อัพเดตระบบ.png", import.meta.url).href,
    description:
      "หมั่นอัปเดตระบบปฏิบัติการ (OS) ซอฟต์แวร์ และแอปพลิเคชันต่างๆ อยู่เสมอเพื่อรับการแก้ไขช่องโหว่ความปลอดภัยล่าสุด",
    example:
      "โทรศัพท์ของคุณแจ้งเตือนให้อัปเดต iOS เวอร์ชันใหม่ที่มีการอุดช่องโหว่ความปลอดภัยระดับวิกฤต คุณจึงกดอัปเดตทันที",
  },
  {
    id: "D5",
    name: "เก็บข้อมูลสำรอง",
    image: new URL("../assets/def/เก็บข้อมูลสำรอง.png", import.meta.url).href,
    description:
      "สำรองไฟล์ (Backup) ข้อมูลสำคัญเก็บไว้ในอุปกรณ์เก็บข้อมูลภายนอก (External Drive) หรือระบบคลาวด์",
    example:
      "เพื่อให้มั่นใจว่างานโปรเจ็กต์สำคัญจะไม่หายไปหากคอมพิวเตอร์โดน Ransomware ล็อก คุณจึงสำรองข้อมูลลง Google Drive ทุกสัปดาห์",
  },
  {
    id: "D6",
    name: "เปลี่ยนรหัสผ่าน",
    image: new URL("../assets/def/เปลียนรหัสผ่าน.png", import.meta.url).href,
    description:
      "ใช้รหัสผ่านที่คาดเดายาก หลีกเลี่ยงการใช้ข้อมูลส่วนตัว เช่น วันเกิด และเปลี่ยนรหัสผ่านทันทีเมื่อสงสัยว่ารหัสรั่วไหล",
    example:
      "มีอีเมลแจ้งเตือนว่ามีคนพยายามล็อกอินเข้าบัญชี Gmail ของคุณจากต่างประเทศ คุณจึงทำการเปลี่ยนรหัสผ่านเป็นรหัสใหม่ทันที",
  },
  {
    id: "D7",
    name: "เปิดยืนยันตัวตน2ชั้น",
    image: new URL("../assets/def/เปิดยืนยันตัวตน2ชั้น.png", import.meta.url)
      .href,
    description:
      "การใช้ระบบ 2FA (Two-Factor Authentication) เพื่อยืนยันตัวตนเพิ่มอีกขั้น เช่น รับรหัสผ่าน SMS หรือแอป Authenticator",
    example:
      "เปิดใช้งาน 2FA บน Instagram แม้คนร้ายจะรู้รหัสผ่านของคุณ แต่ก็ยังล็อกอินไม่ได้ถ้าไม่มีรหัส 6 หลักจากมือถือคุณ",
  },
  {
    id: "D8",
    name: "ไม่คลิกลิงก์",
    image: new URL("../assets/def/ไม่คลิกลิงค์.png", import.meta.url).href,
    description:
      "หลีกเลี่ยงการเปิดลิงก์ที่ไม่รู้จัก ลิงก์ย่อ ลิงก์ที่ส่งต่อกันมาทางแชท หรือลิงก์จากข้อความ SMS ต้องสงสัย",
    example:
      "ได้รับ SMS จากเบอร์ไม่คุ้นบอกว่าเงินกู้อนุมัติแล้วพร้อมแนบลิงก์ให้กดรับสิทธิ์ คุณรู้ทันทีว่าเป็นมิจฉาชีพและกดลบทิ้งโดยไม่คลิกลิงก์",
  },
];

// Evidence cards — 20 Thai evidence assets
export const EVIDENCE_CARDS = [
  {
    id: "E1",
    name: "สแกน QR Code",
    image: new URL("../assets/evidence/Qrcodeไม่ทราบที่มา.png", import.meta.url)
      .href,
  },
  {
    id: "E2",
    name: "Free Wi-Fi",
    image: new URL("../assets/evidence/freewi-fi.png", import.meta.url).href,
  },
  {
    id: "E3",
    name: "SMS รับรางวัล",
    image: new URL("../assets/evidence/smsรับรางวัล.png", import.meta.url).href,
  },
  {
    id: "E4",
    name: "กระดาษ Post-it",
    image: new URL("../assets/evidence/กระดาษ post-it.png", import.meta.url)
      .href,
  },
  {
    id: "E5",
    name: "กล้องวงจรปิด",
    image: new URL("../assets/evidence/กล้องวงจรปิด.png", import.meta.url).href,
  },
  {
    id: "E6",
    name: "คอมพิวเตอร์ห้องสมุด",
    image: new URL(
      "../assets/evidence/คอมพิวเตอร์ห้องสมุด.png",
      import.meta.url,
    ).href,
  },
  {
    id: "E7",
    name: "คูปองส่วนลด",
    image: new URL("../assets/evidence/คูปองส่วนลด.png", import.meta.url).href,
  },
  {
    id: "E8",
    name: "บัตรประชาชน",
    image: new URL("../assets/evidence/บัตรประชาชน.png", import.meta.url).href,
  },
  {
    id: "E9",
    name: "บัตรเครดิต",
    image: new URL("../assets/evidence/บัตรเครติดพ่อแม่.png", import.meta.url)
      .href,
  },
  {
    id: "E10",
    name: "บัตรเติมเกม",
    image: new URL("../assets/evidence/บัตรเติมเกม.png", import.meta.url).href,
  },
  {
    id: "E11",
    name: "ประวัติการค้นหา",
    image: new URL("../assets/evidence/ประวัติการค้นหา.png", import.meta.url)
      .href,
  },
  {
    id: "E12",
    name: "ประวัติการแชท",
    image: new URL("../assets/evidence/ประวัติการแชท.png", import.meta.url)
      .href,
  },
  {
    id: "E13",
    name: "ลิงก์ข่าวปลอม",
    image: new URL("../assets/evidence/ลิงค์ข่าวปลอม.png", import.meta.url)
      .href,
  },
  {
    id: "E14",
    name: "เว็บไม่น่าเชื่อถือ",
    image: new URL(
      "../assets/evidence/ลิงค์เว็บไซต์ไม่น่าเชื่อถือ.png",
      import.meta.url,
    ).href,
  },
  {
    id: "E15",
    name: "หน้าเว็บปลอม",
    image: new URL("../assets/evidence/หน้าเว็บปลอม.png", import.meta.url).href,
  },
  {
    id: "E16",
    name: "อีเมล",
    image: new URL("../assets/evidence/อีเมลโรงเรียน.png", import.meta.url)
      .href,
  },
  {
    id: "E17",
    name: "แฟลชไดร์ฟ",
    image: new URL("../assets/evidence/แฟลชไดร์ฟ.png", import.meta.url).href,
  },
  {
    id: "E18",
    name: "โพสต์แจกตั๋ว",
    image: new URL("../assets/evidence/โพสต์ตั๋วคอนเสิร์ต.png", import.meta.url)
      .href,
  },
  {
    id: "E19",
    name: "รูปเช็คอิน",
    image: new URL("../assets/evidence/รูปเช็คอินร้านค้า.png", import.meta.url)
      .href,
  },
  {
    id: "E20",
    name: "ไฟล์ .exe",
    image: new URL("../assets/evidence/ไฟล์exe.png", import.meta.url).href,
  },
];

// Attack Method cards — mapped to attack/*.png (baiting, hacking, pertexting, phishing, scareware, tailgating)
export const ATTACK_METHODS = [
  {
    id: "A1",
    name: "Phishing (การหลอกลวง)",
    image: new URL("../assets/attack/phishing.png", import.meta.url).href,
  },
  {
    id: "A2",
    name: "Baiting (การล่อลวง)",
    image: new URL("../assets/attack/baiting.png", import.meta.url).href,
  },
  {
    id: "A3",
    name: "Scareware (การข่มขู่)",
    image: new URL("../assets/attack/scareware.png", import.meta.url).href,
  },
  {
    id: "A4",
    name: "Tailgating (การแอบตาม)",
    image: new URL("../assets/attack/tailgating.png", import.meta.url).href,
  },
  {
    id: "A5",
    name: "Pretexting (การแต่งเรื่อง)",
    image: new URL("../assets/attack/pertexting.png", import.meta.url).href,
  },
  {
    id: "A6",
    name: "Hacking (การเจาะระบบ)",
    image: new URL("../assets/attack/hacking.png", import.meta.url).href,
  },
];

// Clue cards — mapped to hint/*.png categories
export const CLUE_CARDS = [
  {
    id: "C1",
    category: "การแอบอ้าง",
    image: new URL("../assets/hint/abbaung.png", import.meta.url).href,
    options: ["คนไม่รู้จัก", "เพื่อน", "ผู้มีอำนาจ", "ระบบ/ซอฟต์แวร์"],
  },
  {
    id: "C2",
    category: "ช่วงเวลาที่โจมตี",
    image: new URL("../assets/hint/time.png", import.meta.url).href,
    options: ["เช้า", "กลางวัน", "เย็น", "กลางคืน"],
  },
  {
    id: "C3",
    category: "มูลค่าความเสียหาย",
    image: new URL("../assets/hint/value.png", import.meta.url).href,
    options: ["ทรัพย์สิน", "ข้อมูลส่วนตัว", "ความลับ", "ร่างกาย"],
  },
  {
    id: "C4",
    category: "สภาพของหลักฐาน",
    image: new URL("../assets/hint/status.png", import.meta.url).href,
    options: [
      "ถูกล็อก/ปิดอยู่",
      "เปิดเผยสาธารณะ",
      "ชำรุดเสียหาบ",
      "ไม่พบร่องรอย",
    ],
  },
  {
    id: "C5",
    category: "ประเภทของหลักฐาน",
    image: new URL("../assets/hint/type.png", import.meta.url).href,
    options: [
      "กระดาษเอกสาร",
      "อุปกรณ์อิเล็กทรอนิกส์",
      "หน้าจอข้อมูลดิจิทัล",
      "ของใช้ส่วนตัว",
    ],
  },
  {
    id: "C6",
    category: "จุดอ่อนของเหยื่อ",
    image: new URL("../assets/hint/judden.png", import.meta.url).href,
    options: ["ความโลภ", "ความกลัว", "ความไว้ใจ", "การไม่ระวังตัว"],
  },
  {
    id: "C7",
    category: "สถานที่โจมตี",
    image: new URL("../assets/hint/place.png", import.meta.url).href,
    options: ["โรงเรียน", "บ้าน", "สถานที่สาธารณะ", "โซเชียลมีเดีย"],
  },
  {
    id: "C8",
    category: "กิจกรรมที่เหยื่อทำอยู่",
    image: new URL("../assets/hint/act.png", import.meta.url).href,
    options: [
      "กิจกรรมความบันเทิง",
      "เรียน/ทำงาน",
      "ทำธุรกรรมทางการเงิน",
      "การติดต่อสื่อสาร/การแชท",
    ],
  },
  {
    id: "C9",
    category: "ลักษณะของหลักฐาน",
    image: new URL("../assets/hint/property.png", import.meta.url).href,
    options: ["ไม่มีตัวหนังสือ", "ซอฟต์แวร์", "จับต้องได้", "มีสีสัน"],
  },
];

export const MAX_PLAYERS = 8;
export const MIN_PLAYERS = 5;
