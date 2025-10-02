'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Player {
	id: number;
	name: string;
	position: string;
	overall: number;
	ranking: number;
	state: string;
}

interface Team {
	id: number;
	name: string;
	overall: number;
	players: Player[];
}

interface League {
	id: number;
	name: string;
	teams: Team[];
}

type SortField =
	| 'overall'
	| 'potential'
	| 'name'
	| 'state'
	| 'position'
	| 'stars';
type SortOrder = 'asc' | 'desc';

export default function Home() {
	const [leagues, setLeagues] = useState<League[]>([]);
	const [players, setPlayers] = useState<Player[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [sortField, setSortField] = useState<SortField>('overall');
	const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

	const fetchData = async () => {
		try {
			// Fetch leagues and teams
			const leaguesResponse = await fetch(
				'http://localhost:8000/league/leagues/'
			);
			if (!leaguesResponse.ok) throw new Error('Failed to fetch leagues');
			const leaguesData = await leaguesResponse.json();
			setLeagues(leaguesData);

			// Fetch recruiting classes and get the first one
			const recruitingClassesResponse = await fetch(
				'http://localhost:8000/players/recruiting-classes/'
			);
			if (!recruitingClassesResponse.ok)
				throw new Error('Failed to fetch recruiting classes');
			const recruitingClasses = await recruitingClassesResponse.json();

			if (recruitingClasses.length > 0) {
				// Get the first (latest) recruiting class
				const firstClass = recruitingClasses[0];
				const playersResponse = await fetch(
					`http://localhost:8000/players/class/${firstClass.id}/?sort_by=${sortField}&sort_order=${sortOrder}`
				);
				if (!playersResponse.ok) throw new Error('Failed to fetch players');
				const playersData = await playersResponse.json();
				setPlayers(playersData.players || []);
			} else {
				setPlayers([]);
			}

			setLoading(false);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'An error occurred');
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, [sortField, sortOrder]);

	const handleSort = (field: SortField) => {
		if (sortField === field) {
			// Toggle sort order if same field
			setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
		} else {
			// New field, default to descending
			setSortField(field);
			setSortOrder('desc');
		}
	};

	const getSortIcon = (field: SortField) => {
		if (sortField !== field) return '↕️';
		return sortOrder === 'asc' ? '↑' : '↓';
	};

	if (loading) {
		return (
			<div className='min-h-screen flex items-center justify-center'>
				<div className='text-xl'>Loading...</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className='min-h-screen flex items-center justify-center'>
				<div className='text-xl text-red-500'>Error: {error}</div>
			</div>
		);
	}

	return (
		<div className='min-h-screen p-8 bg-gray-50'>
			<div className='max-w-7xl mx-auto'>
				<div className='flex justify-between items-center mb-8'>
					<h1 className='text-4xl font-bold text-gray-900'>
						NCAA Basketball Simulation
					</h1>
					<nav className='flex space-x-4'>
						<Link 
							href='/map' 
							className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
						>
							View Map
						</Link>
					</nav>
				</div>

				{/* Players Section */}
				<section>
					<div className='flex justify-between items-center mb-4'>
						<h2 className='text-2xl font-semibold text-gray-800'>
							Top Recruits
						</h2>
						<div className='text-sm text-gray-600'>
							Sorted by: {sortField} ({sortOrder})
						</div>
					</div>
					{players.length === 0 ? (
						<p className='text-gray-600'>
							No players found. Generate a recruiting class to get started!
						</p>
					) : (
						<div className='bg-white rounded-lg shadow-md overflow-hidden'>
							<div className='overflow-x-auto'>
								<table className='min-w-full divide-y divide-gray-200'>
									<thead className='bg-gray-100'>
										<tr>
											<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
												Rank
											</th>
											<th
												className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-200'
												onClick={() => handleSort('name')}>
												Name {getSortIcon('name')}
											</th>
											<th
												className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-200'
												onClick={() => handleSort('position')}>
												Position {getSortIcon('position')}
											</th>
											<th
												className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-200'
												onClick={() => handleSort('state')}>
												State {getSortIcon('state')}
											</th>
											<th
												className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-200'
												onClick={() => handleSort('overall')}>
												Overall {getSortIcon('overall')}
											</th>
											<th
												className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-200'
												onClick={() => handleSort('stars')}>
												Stars {getSortIcon('stars')}
											</th>
										</tr>
									</thead>
									<tbody className='bg-white divide-y divide-gray-200'>
										{players.slice(0, 20).map((player, index) => (
											<tr key={player.id} className='hover:bg-gray-50'>
												<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
													#{index + 1}
												</td>
												<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
													{player.name}
												</td>
												<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
													{player.position}
												</td>
												<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
													{player.state}
												</td>
												<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600'>
													{player.overall}
												</td>
												<td className='px-6 py-4 whitespace-nowrap text-sm text-yellow-500'>
													{'★'.repeat(player.ranking)}
													{'☆'.repeat(5 - player.ranking)}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
							{players.length > 20 && (
								<div className='px-6 py-4 bg-gray-50 border-t border-gray-200 text-sm text-gray-500'>
									Showing top 20 of {players.length} players
								</div>
							)}
						</div>
					)}
				</section>
			</div>
		</div>
	);
}
