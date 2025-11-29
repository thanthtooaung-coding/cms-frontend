import React, { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTenantPath } from "@/hooks/useTenantPath";
import Chart from "chart.js/auto";

const AboutPage = () => {
  const navigate = useNavigate();
  const { getPath } = useTenantPath();
  // Sample data
  const monthlyUsersData = {
    labels: ["Jan 2025", "Feb 2025", "Mar 2025", "Apr 2025", "May 2025", "Jun 2025", "Jul 2025", "Aug 2025"],
    datasets: [{
      label: "Monthly Users (in thousands)",
      data: [5, 6, 8, 10, 12, 15, 18, 20],
      backgroundColor: "rgba(161, 0, 255, 0.6)",
      borderColor: "rgba(161, 0, 255, 1)",
      borderWidth: 1
    }]
  };

  const usageRatesData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [{
      label: "Usage Rate (%)",
      data: [60, 65, 70, 75],
      borderColor: "rgba(161, 0, 255, 1)",
      backgroundColor: "rgba(161, 0, 255, 0.2)",
      fill: true,
      tension: 0.4
    }]
  };

  const bookingsData = {
    labels: ["Jan 2025", "Feb 2025", "Mar 2025", "Apr 2025", "May 2025", "Jun 2025", "Jul 2025", "Aug 2025"],
    datasets: [{
      label: "Bookings (in thousands)",
      data: [2, 3, 4, 5, 6, 7, 8, 9],
      backgroundColor: "rgba(255, 99, 132, 0.6)",
      borderColor: "rgba(255, 99, 132, 1)",
      borderWidth: 1
    }]
  };

  // Chart refs
  const monthlyUsersChartRef = useRef(null);
  const usageRatesChartRef = useRef(null);
  const bookingsChartRef = useRef(null);

  useEffect(() => {
    if (monthlyUsersChartRef.current && usageRatesChartRef.current && bookingsChartRef.current) {
      new Chart(monthlyUsersChartRef.current.getContext("2d"), {
        type: "bar",
        data: monthlyUsersData,
        options: { scales: { y: { beginAtZero: true } }, plugins: { legend: { display: false } }, animation: { duration: 1500 } }
      });
      new Chart(usageRatesChartRef.current.getContext("2d"), {
        type: "line",
        data: usageRatesData,
        options: { scales: { y: { beginAtZero: true, max: 100 } }, plugins: { legend: { display: false } }, animation: { duration: 1500 } }
      });
      new Chart(bookingsChartRef.current.getContext("2d"), {
        type: "bar",
        data: bookingsData,
        options: { scales: { y: { beginAtZero: true } }, plugins: { legend: { display: false } }, animation: { duration: 1500 } }
      });
      return () => {
        Chart.getChart(monthlyUsersChartRef.current)?.destroy();
        Chart.getChart(usageRatesChartRef.current)?.destroy();
        Chart.getChart(bookingsChartRef.current)?.destroy();
      };
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-cinema">
      <div className="container mx-auto px-4 py-12 space-y-12">
        {/* Hero Section with Video Placeholder */}
        <section className="relative text-center space-y-6 overflow-hidden rounded-lg">
          <video
            autoPlay
            muted
            loop
            className="absolute inset-0 w-full h-full object-cover opacity-50"
          >
            <source src="/lovable-uploads/hero-video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="relative z-10 space-y-6 py-20 bg-background/80">
            <h1 className="text-5xl font-bold text-foreground">About CELESTIX</h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              CELESTIX is a premier movie ticket booking platform offering seamless access to the latest films, advanced search filters, and real-time showtime schedules. Launched in 2021, we’ve grown to serve movie enthusiasts globally, enhancing their cinematic experience with innovative features.
            </p>
            <button className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/80 transition-colors" onClick={() => navigate(getPath("/discover"))}>
              Explore Movies
            </button>
          </div>
        </section>

        {/* Our Mission and Vision */}
        <section className="space-y-6 bg-card/50 border border-border/50 rounded-lg p-6 text-center">
          <h2 className="text-3xl font-bold text-foreground">Our Mission & Vision</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our mission is to revolutionize movie-going by providing a seamless booking experience with cutting-edge technology. We envision becoming the global leader in digital cinema access, reaching millions of users by 2030 with personalized features and eco-friendly initiatives.
          </p>
        </section>

        {/* Our Story */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-foreground text-center">Our Story</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card/50 border border-border/50 rounded-lg p-4 text-center">
              <img
                src="/lovable-uploads/2021.jfif"
                alt="CELESTIX Launch 2021"
                className="w-full h-40 object-cover rounded-t-lg mb-2"
              />
              <h3 className="text-lg font-semibold text-foreground">2021</h3>
              <p className="text-muted-foreground">CELESTIX launched with its first movie booking feature.</p>
            </div>
            <div className="bg-card/50 border border-border/50 rounded-lg p-4 text-center">
              <img
                src="/lovable-uploads/2023.jfif"
                alt="Advanced Search 2023"
                className="w-full h-40 object-cover rounded-t-lg mb-2"
              />
              <h3 className="text-lg font-semibold text-foreground">2023</h3>
              <p className="text-muted-foreground">Introduced advanced search and filter options.</p>
            </div>
            <div className="bg-card/50 border border-border/50 rounded-lg p-4 text-center">
              <img
                src="/lovable-uploads/2025.jfif"
                alt="20,000+ Users 2025"
                className="w-full h-40 object-cover rounded-t-lg mb-2"
              />
              <h3 className="text-lg font-semibold text-foreground">2025</h3>
              <p className="text-muted-foreground">Expanded to 20,000+ users worldwide.</p>
            </div>
          </div>
        </section>

        {/* Featured Achievements */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-foreground text-center">Featured Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card/50 border border-border/50 rounded-lg p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-2 text-primary">🎉</div> {/* Placeholder icon */}
              <h3 className="text-lg font-semibold text-foreground">10,000 Bookings</h3>
              <p className="text-muted-foreground">Reached in June 2024</p>
            </div>
            <div className="bg-card/50 border border-border/50 rounded-lg p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-2 text-primary">🏆</div>
              <h3 className="text-lg font-semibold text-foreground">Best New Platform</h3>
              <p className="text-muted-foreground">Awarded in 2023</p>
            </div>
            <div className="bg-card/50 border border-border/50 rounded-lg p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-2 text-primary">🌍</div>
              <h3 className="text-lg font-semibold text-foreground">Global Reach</h3>
              <p className="text-muted-foreground">20,000+ users in 2025</p>
            </div>
          </div>
        </section>        

        {/* Trusted By */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-foreground text-center">Trusted By</h2>
          <div className="flex justify-center space-x-8">
            <img
              src="/lovable-uploads/1.png"
              alt="Partner 1"
              className="w-24 h-12 object-contain bg-card/50 rounded-lg"
            />
            <img
              src="/lovable-uploads/2.jfif"
              alt="Partner 2"
              className="w-24 h-12 object-contain bg-card/50 rounded-lg"
            />
            <img
              src="/lovable-uploads/3.png"
              alt="Partner 3"
              className="w-24 h-12 object-contain bg-card/50 rounded-lg"
            />
          </div>
        </section>

        {/* Customer Reviews */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-foreground text-center">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card/50 border border-border/50 rounded-lg p-6 text-center">
              <p className="text-muted-foreground italic">"Amazing platform! Booking was so easy!"</p>
              <p className="mt-2 text-foreground font-semibold">- John D.</p>
              <div className="flex justify-center mt-2 text-yellow-400">★★★★★</div>
            </div>
            <div className="bg-card/50 border border-border/50 rounded-lg p-6 text-center">
              <p className="text-muted-foreground italic">"Love the advanced search feature!"</p>
              <p className="mt-2 text-foreground font-semibold">- Sarah K.</p>
              <div className="flex justify-center mt-2 text-yellow-400">★★★★☆</div>
            </div>
          </div>
        </section>

        {/* Latest Updates */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-foreground text-center">Latest Updates</h2>
          <div className="space-y-4">
            <div className="bg-card/50 border border-border/50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-foreground">August 2025</h3>
              <p className="text-muted-foreground">Added support for 4K movie previews.</p>
            </div>
            <div className="bg-card/50 border border-border/50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-foreground">July 2025</h3>
              <p className="text-muted-foreground">Partnered with major theater chains.</p>
            </div>
          </div>
        </section>

        {/* Stats Section with Expanded Charts */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-foreground text-center">Our Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card/50 border border-border/50 rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
              <h3 className="text-xl font-semibold text-foreground">Total Users</h3>
              <p className="text-3xl font-bold text-primary">20,000+</p>
            </div>
            <div className="bg-card/50 border border-border/50 rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
              <h3 className="text-xl font-semibold text-foreground">Active Users</h3>
              <p className="text-3xl font-bold text-primary">15,000</p>
            </div>
            <div className="bg-card/50 border border-border/50 rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
              <h3 className="text-xl font-semibold text-foreground">Total Bookings</h3>
              <p className="text-3xl font-bold text-primary">9,000+</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card/50 border border-border/50 rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
              <h3 className="text-xl font-semibold text-foreground">Monthly Users</h3>
              <canvas ref={monthlyUsersChartRef} className="w-full h-64"></canvas>
            </div>
            <div className="bg-card/50 border border-border/50 rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
              <h3 className="text-xl font-semibold text-foreground">Usage Rate</h3>
              <canvas ref={usageRatesChartRef} className="w-full h-64"></canvas>
            </div>
            <div className="bg-card/50 border border-border/50 rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
              <h3 className="text-xl font-semibold text-foreground">Monthly Bookings</h3>
              <canvas ref={bookingsChartRef} className="w-full h-64"></canvas>
            </div>
          </div>
        </section>

        {/* Follow Us */}
<section className="space-y-6 bg-card/50 border border-border/50 rounded-lg p-6 text-center">
  <h2 className="text-3xl font-bold text-foreground">Follow Us</h2>
  <p className="text-muted-foreground">Stay connected with us on social media</p>
  <div className="flex justify-center space-x-6 mt-4">
    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-3xl">
      <i className="fab fa-facebook-square"></i> {/* Facebook Icon */}
    </a>
    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-600 text-3xl">
      <i className="fab fa-twitter-square"></i> {/* Twitter Icon */}
    </a>
    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-pink-500 hover:text-pink-700 text-3xl">
      <i className="fab fa-instagram-square"></i> {/* Instagram Icon */}
    </a>
    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 text-3xl">
      <i className="fab fa-linkedin"></i> {/* LinkedIn Icon */}
    </a>
  </div>
</section>


        {/* Get in Touch */}
        <section className="space-y-6 bg-card/50 border border-border/50 rounded-lg p-6 text-center">
          <h2 className="text-3xl font-bold text-foreground">Get in Touch</h2>
          <p className="text-muted-foreground">Have questions? Reach us at support@celestix.com or call +1-800-CELESTIX.</p>
          <button className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/80 transition-colors" onClick={() => alert("Contact form coming soon!")}>
            Contact Us
          </button>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;