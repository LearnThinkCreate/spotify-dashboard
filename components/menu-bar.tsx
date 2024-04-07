import Link from 'next/link';


export const MenuBar = ({  }) => {
    return (
    <div className="flex justify-center space-x-10 pt-3">
        <Link href={{
            pathname: '/',
            // query: searchParams
        
        }}>
            Go to Cards
        </Link>
        <Link href={{
            pathname: '/graph',
            // query: searchParams
        }}>
            Go To Graphs
        </Link>
    </div>
    )
}