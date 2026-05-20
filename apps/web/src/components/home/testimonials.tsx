import { StarRating } from '@/components/ui/star-rating';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const TESTIMONIALS = [
  {
    quote:
      'The electrician arrived within 30 minutes and fixed everything professionally. Will definitely use HirePro again!',
    name: 'Fatima Malik',
    city: 'Karachi',
    service: 'Electrician',
    rating: 5,
    initials: 'FM',
  },
  {
    quote:
      'Booking was so easy. The plumber was polite, on time, and the work was done neatly. Great experience.',
    name: 'Hamza Sheikh',
    city: 'Lahore',
    service: 'Plumber',
    rating: 5,
    initials: 'HS',
  },
  {
    quote:
      'The cleaning team was thorough and professional. My apartment looks brand new. Highly recommended!',
    name: 'Nadia Qureshi',
    city: 'Islamabad',
    service: 'Cleaning',
    rating: 5,
    initials: 'NQ',
  },
];

export function Testimonials() {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">What Customers Say</h2>
          <p className="mt-2 text-muted-foreground">
            Thousands of happy customers across Pakistan
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="flex flex-col gap-4 rounded-xl border bg-card p-6 shadow-sm"
            >
              <StarRating value={t.rating} size="sm" />

              <blockquote className="text-sm text-foreground leading-relaxed flex-1">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              <div className="flex items-center gap-3 pt-2 border-t">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary">
                    {t.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {t.city} · {t.service}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
