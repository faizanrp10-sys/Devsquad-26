import { gsap } from 'gsap';

export const fadeIn = (element, delay = 0) => {
  gsap.fromTo(
    element,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.8, delay, ease: 'power3.out' }
  );
};

export const staggerFadeIn = (elements, delay = 0) => {
  gsap.fromTo(
    elements,
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.2,
      delay,
      ease: 'power3.out',
    }
  );
};

export const scaleIn = (element, delay = 0) => {
  gsap.fromTo(
    element,
    { scale: 0.8, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.6, delay, ease: 'back.out(1.7)' }
  );
};

export const slideUp = (element, delay = 0) => {
    gsap.fromTo(
      element,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, delay, ease: 'power3.out' }
    );
  };
  
export const countUp = (element, targetValue) => {
    const obj = { value: 0 };
    gsap.to(obj, {
        value: targetValue,
        duration: 2,
        ease: "power3.out",
        onUpdate: () => {
            element.innerText = Math.floor(obj.value);
        }
    });
};
