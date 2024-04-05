import Link from 'next/link';

export const MenuBar = ({ searchParams }) => {
    return (
    <div className="flex justify-center space-x-10 pb-6">
        <Link href={{
            pathname: '/',
            query: searchParams
        
        }}>
            Go to Cards
        </Link>
        <Link href={{
            pathname: '/lineGraph',
            query: searchParams
        
        }}>
            Go to Line Graph
        </Link>
        <Link href={{
            pathname: '/barGraph',
            query: searchParams
        }}>
            Go to Bar Graph
        </Link>
    </div>
    )
}