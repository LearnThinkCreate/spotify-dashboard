import Link from 'next/link';

export const MenuBar = () => (
    <div className="flex justify-center space-x-10 pb-6">
        <Link href="/">
            Go to Cards
        </Link>
        <Link href="/lineGraph">
            Go to Line Graph
        </Link>
        <Link href="/barGraph">
            Go to Bar Graph
        </Link>
    </div>
)