export interface OnboardingSlide {
  id: string;
  image: any;
  title: string;
  description: string;
}

export const ONBOARDING_SLIDES: OnboardingSlide[] = [
  {
    id: "1",
    image: require("../assets/images/onboarding1.png"),
    title: "Set Financial Goals",
    description:
      "Define your savings and financial goals. Build a clear roadmap toward financial success.",
  },
  {
    id: "2",
<<<<<<< HEAD
    image: require("../assets/cimages/onboarding2.png"),
=======
    image: require("../assets/images/onboarding2.png"),
>>>>>>> f74c49fa451ab3731a3f96b4b20b267ad1812622
    title: "Track Your Progress",
    description:
      "Monitor your financial growth and stay motivated with real-time progress tracking.",
  },
  {
    id: "3",
    image: require("../assets/images/onboarding3.png"),
    title: "Celebrate Achievements",
    description:
      "Reach important milestones and celebrate every step toward financial freedom.",
  },
];
