/*export const companyInfo = `
Introduction:
Hello! I'm your friendly CineFlix Chatbot 🤖, here to assist you with all your online cinema ticketing and food ordering needs. Whether you want to know today's or tomorrow's movies, showtimes, theaters, or our snacks and drinks, I'm here to help!

Cinema Details:
CineFlix is your ultimate online destination for booking cinema tickets and ordering delicious snacks and drinks. We showcase the latest movies across multiple genres including Action, Comedy, Drama, Horror, and Animation. You can easily check movie schedules, book your favorite seats, and enjoy a seamless cinema experience from the comfort of your home.

Location & Contact:
While our ticketing system is online, our main cinema hall is located at 456 Movie Avenue, Film City, CA 90001.  
For inquiries, contact us via email at support@cineflix.com or call +1 (555) 987-6543.

Movie Showtimes:

Today:
- Theater 1: Spider Heroes — 10:00 AM, 1:00 PM, 4:00 PM, 7:00 PM
- Theater 2: Laugh Out Loud — 11:30 AM, 2:30 PM, 5:30 PM, 8:30 PM
- Theater 3: Mystery Mansion — 12:00 PM, 3:00 PM, 6:00 PM, 9:00 PM
- Theater 4: Galactic Wars — 10:15 AM, 1:15 PM, 4:15 PM, 7:15 PM
- Theater 5: Animated Adventure — 9:00 AM, 12:00 PM, 3:00 PM, 6:00 PM

Tomorrow:
- Theater 1: Spider Heroes — 10:30 AM, 1:30 PM, 4:30 PM, 7:30 PM
- Theater 2: Laugh Out Loud — 11:45 AM, 2:45 PM, 5:45 PM, 8:45 PM  
- Theater 3: Mystery Mansion — 12:15 PM, 3:15 PM, 6:15 PM, 9:15 PM
- Theater 4: Galactic Wars — 10:45 AM, 1:45 PM, 4:45 PM, 7:45 PM
- Theater 5: Animated Adventure — 9:30 AM, 12:30 PM, 3:30 PM, 6:30 PM

Ticket Booking:
- Standard Ticket: $12
- Premium Ticket: $18
- VIP Ticket (Recliner Seat + Complimentary Snacks): $25
- Online booking is available 24/7. Simply select the movie, time, and seat to confirm.

Food & Drinks Menu:
Snacks:
- Popcorn (Small $3 / Medium $5 / Large $7)
- Nachos with Cheese $6
- Pretzel $4
- Candy Mix $5

Drinks:
- Soft Drinks (Coke, Pepsi, Sprite) $3
- Fresh Juice (Orange, Apple, Pineapple) $4
- Coffee (Espresso / Latte / Cappuccino) $5
- Bottled Water $2

Food:
- Hot Dog $5
- Pizza Slice (Cheese / Pepperoni / Veggie) $4
- Chicken Wings (6 pcs) $6
- Burger Combo (Burger + Fries + Drink) $9

Ordering Instructions:
- You can order food online before or during the movie.
- Select items, add to cart, and proceed to checkout.
- Food will be delivered to your seat in the cinema or prepared for pickup if watching at home.

Social Media & Updates:
Follow us for the latest movie releases, special promotions, and events:  
- Facebook: https://facebook.com/cineflix  
- Instagram: https://instagram.com/cineflix  
- Twitter: https://twitter.com/cineflix  

Website:
Visit https://www.cineflix.com for full showtimes, ticket booking, and online food ordering.  

At CineFlix, we believe in creating unforgettable movie experiences. Whether it’s your favorite blockbuster, a new release, or a cozy snack night at the cinema, we’ve got everything you need for a perfect movie day!
`;
*/
// src/chatbot/components/companyInfo.ts
// src/chatbot/components/companyInfo.ts
import { fetchApi, fetchWithAuth } from "@/lib/api";

const formatMovies = (movies: any[], title: string) => {
  if (movies.length === 0) {
    return `### ${title}\n- No movies available in this category.\n`;
  }
  return `### ${title}\n` + movies.map(movie => {
    const genres = movie.genres.map((g: any) => g.name).join(", ");
    return `- **${movie.title}**\n  - **Duration:** ${movie.duration}\n  - **Genre:** ${genres}\n  - **Release Date:** ${movie.releaseDate}\n  - **Rating:** ${movie.rating}\n`;
  }).join("\n");
};

const formatFoodItems = (foodItems: any[]) => {
  if (foodItems.length === 0) {
    return "- No food items available.\n";
  }
  return foodItems.map(food => `- **${food.name}**: ${food.price} Ks\n  - **Description:** ${food.description || "N/A"}\n  - **Allergens:** ${food.allergens || "N/A"}\n`).join("");
};

const formatCombos = (combos: any[]) => {
  if (combos.length === 0) {
    return "- No combos available.\n";
  }
  return combos.map(combo => {
    const items = combo.foods.map((f: any) => f.name).join(" + ");
    return `- **${combo.comboName}**: ${combo.comboPrice} Ks\n  - **Includes:** ${items}\n`;
  }).join("");
};

const formatShowtimes = (showtimes: any[]) => {
  if (showtimes.length === 0) {
    return "No showtime schedules available at the moment.\n";
  }

  const groupedShowtimes: { [key: string]: { [key: string]: string[] } } = {};
  showtimes.forEach(st => {
    const movieTitle = st.movie.title;
    const theaterName = st.theater.name;
    const date = st.showtimeDate;
    const time = st.showtimeTime.substring(0, 5);

    if (!groupedShowtimes[movieTitle]) {
      groupedShowtimes[movieTitle] = {};
    }
    if (!groupedShowtimes[movieTitle][theaterName]) {
      groupedShowtimes[movieTitle][theaterName] = [];
    }
    groupedShowtimes[movieTitle][theaterName].push(`${date} at ${time}`);
  });

  let showtimeInfo = "";
  for (const movieTitle in groupedShowtimes) {
    showtimeInfo += `**${movieTitle}**\n`;
    for (const theaterName in groupedShowtimes[movieTitle]) {
      const showtimeDetails = groupedShowtimes[movieTitle][theaterName].join(", ");
      showtimeInfo += `  - **${theaterName}**: ${showtimeDetails}\n`;
    }
    showtimeInfo += "\n";
  }

  return showtimeInfo;
};

export const generateCompanyInfo = async () => {
  let nowShowingMovies: any[] = [];
  let comingSoonMovies: any[] = [];
  let foodItems: any[] = [];
  let foodCombos: any[] = [];
  let allShowtimes: any[] = [];

  try {
    const [moviesRes, comingSoonRes, foodRes, combosRes, showtimesRes] = await Promise.all([
      fetchApi("/public/movies?status=Now Showing"),
      fetchApi("/public/movies?status=Coming Soon"),
      fetchWithAuth("/food"),
      fetchWithAuth("/food/combos"),
      fetchWithAuth("/showtimes"),
    ]);

    if (moviesRes.ok) {
        const data = await moviesRes.json();
        nowShowingMovies = data.data;
    }
    
    if (comingSoonRes.ok) {
        const data = await comingSoonRes.json();
        comingSoonMovies = data.data;
    }

    if (foodRes.ok) {
        const result = await foodRes.json();
        foodItems = result.data || result;
    }
    
    if (combosRes.ok) {
        const result = await combosRes.json();
        foodCombos = result.data || result;
    }

    if(showtimesRes.ok){
      const data = await showtimesRes.json();
      allShowtimes = data.data;
    }

  } catch (error) {
    console.error("Failed to fetch data for chatbot:", error);
  }

  const movieSection = 
    `## All Movie Showtimes\n` +
    `Here are all the movie showtimes available:\n\n` +
    formatShowtimes(allShowtimes);

  const nowShowingSection = formatMovies(nowShowingMovies, "Now Showing");
  const comingSoonSection = formatMovies(comingSoonMovies, "Coming Soon");

  const foodSection = `## Food & Drinks Menu\n` +
    `### Combos\n` + formatCombos(foodCombos) +
    `\n### Individual Items\n` + formatFoodItems(foodItems);

  return `
Introduction:
Hello! I'm your friendly CELESTIX Chatbot 🤖, here to assist you with all your online cinema ticketing and food ordering needs.

Cinema Details:
CELESTIX is your ultimate online destination for booking cinema tickets and ordering delicious snacks and drinks. You can easily check movie schedules, book your favorite seats, and enjoy a seamless cinema experience from the comfort of your home.

${movieSection}

${nowShowingSection}

${comingSoonSection}

${foodSection}

Social Media & Updates:
Follow us for the latest movie releases, special promotions, and events:
- Facebook: [https://facebook.com/celestix](https://facebook.com)
- Instagram: [https://instagram.com/celestix](https://instagram.com)
- Twitter: [https://twitter.com/celestix](https://twitter.com)

Website:
Visit [https://www.celestix.com](https://www.celestix.com) for full showtimes, ticket booking, and online food ordering.
`;
};