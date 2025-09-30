'use client';

import { useEffect, useState } from 'react';

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

export default function Home() {
	const [leagues, setLeagues] = useState<League[]>([]);
	const [players, setPlayers] = useState<Player[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				// Fetch leagues and teams
				const leaguesResponse = await fetch(
					'http://localhost:8000/league/leagues/'
				);
				if (!leaguesResponse.ok) throw new Error('Failed to fetch leagues');
				const leaguesData = await leaguesResponse.json();
				setLeagues(leaguesData);

				// Fetch all players
				const playersResponse = await fetch(
					'http://localhost:8000/players/all/'
				);
				if (!playersResponse.ok) throw new Error('Failed to fetch players');
				const playersData = await playersResponse.json();
				setPlayers(playersData);

				setLoading(false);
			} catch (err) {
				setError(err instanceof Error ? err.message : 'An error occurred');
				setLoading(false);
			}
		};

		fetchData();
	}, []);

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
				<h1 className='text-4xl font-bold mb-8 text-gray-900'>
					NCAA Basketball Simulation
				</h1>

				{/* Leagues Section */}
				<section className='mb-12'>
					<h2 className='text-2xl font-semibold mb-4 text-gray-800'>
						Leagues & Teams
					</h2>
					{leagues.length === 0 ? (
						<p className='text-gray-600'>
							No leagues found. Create a league to get started!
						</p>
					) : (
						<div className='space-y-6'>
							{leagues.map((league) => (
								<div
									key={league.id}
									className='bg-white rounded-lg shadow-md p-6'>
									<h3 className='text-xl font-semibold mb-4 text-blue-600'>
										{league.name}
									</h3>
									{league.teams.length === 0 ? (
										<p className='text-gray-500'>
											No teams in this league yet.
										</p>
									) : (
										<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
											{league.teams.map((team) => (
												<div
													key={team.id}
													className='border border-gray-200 rounded-lg p-4 hover:border-blue-400 transition'>
													<div className='flex justify-between items-center mb-2'>
														<h4 className='font-semibold text-gray-900'>
															{team.name}
														</h4>
														<span className='text-sm font-medium text-blue-600'>
															OVR: {team.overall}
														</span>
													</div>
													<p className='text-sm text-gray-600'>
														{team.players.length} players
													</p>
												</div>
											))}
										</div>
									)}
								</div>
							))}
						</div>
					)}
				</section>

				{/* Players Section */}
				<section>
					<h2 className='text-2xl font-semibold mb-4 text-gray-800'>
						Top Recruits
					</h2>
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
											<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
												Name
											</th>
											<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
												Position
											</th>
											<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
												State
											</th>
											<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
												Overall
											</th>
											<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
												Stars
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
