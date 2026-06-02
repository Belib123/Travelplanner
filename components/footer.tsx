import Link from 'next/link'
import { Compass, Github, Twitter } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-primary/10 rounded-lg">
                <Compass className="h-6 w-6 text-primary" />
              </div>
              <span className="font-bold text-xl">Wanderlust</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Plan your dream trips, discover amazing destinations, and create unforgettable memories.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/destinations" className="text-muted-foreground hover:text-foreground transition-colors">
                  All Destinations
                </Link>
              </li>
              <li>
                <Link href="/destinations?continent=Europe" className="text-muted-foreground hover:text-foreground transition-colors">
                  Europe
                </Link>
              </li>
              <li>
                <Link href="/destinations?continent=Asia" className="text-muted-foreground hover:text-foreground transition-colors">
                  Asia
                </Link>
              </li>
              <li>
                <Link href="/destinations?continent=North America" className="text-muted-foreground hover:text-foreground transition-colors">
                  North America
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Features</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
                  Trip Planning
                </Link>
              </li>
              <li>
                <Link href="/budget" className="text-muted-foreground hover:text-foreground transition-colors">
                  Budget Calculator
                </Link>
              </li>
              <li>
                <Link href="/favorites" className="text-muted-foreground hover:text-foreground transition-colors">
                  Saved Destinations
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-muted-foreground hover:text-foreground transition-colors">
                  Travel Profile
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <div className="flex gap-3">
              <a 
                href="#" 
                className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Wanderlust. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
