const faqs = [
  {
    question: "How do I export my expense data?",
    answer:
      "You can export your data by going to Settings > Data Management and selecting either CSV or PDF export format. The exported file will include all your transactions, categories, and summary information.",
    category_id: 1, // general
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    question: "Can I sync my data across multiple devices?",
    answer:
      "Yes! Your data is automatically synced across all devices when you're logged into your account. Make sure you're using the same email address on all devices.",
    category_id: 2, // technical
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    question: "How do I delete my account?",
    answer:
      "To delete your account, go to Settings > Security & Privacy > Delete Account. Please note that this action is irreversible and all your data will be permanently removed.",
    category_id: 3, // account
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and Apple Pay. All payments are processed securely through our payment partners.",
    category_id: 4, // billing
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    question: "The app is running slowly. What should I do?",
    answer:
      "Try closing and reopening the app first. If the issue persists, check for app updates in your app store. You can also try restarting your device or clearing the app cache.",
    category_id: 2, // technical
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    question: "How do I set up budget alerts?",
    answer:
      'Go to Settings > Notifications and enable "Budget Alerts". You can set custom thresholds for different categories and receive notifications when you\'re approaching your limits.',
    category_id: 1, // general
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

module.exports = faqs;
