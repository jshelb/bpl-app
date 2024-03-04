import copy
import itertools
from collections import Counter, defaultdict
import random

def divide_teams_evenly(teams: list[str], num_groups: int):
    """
    Divide teams into groups more evenly.

    Args:
        teams (list): List of team identifiers.
        num_groups (int): Number of groups to divide teams into.

    Returns:
        list: List of groups containing teams.

    """
    teams_per_group = len(teams) // num_groups
    remainder = len(teams) % num_groups

    initial_groups = []
    start = 0
    for i in range(num_groups):
        group_size = teams_per_group + 1 if i < remainder else teams_per_group
        initial_groups.append(teams[start:start + group_size])
        start += group_size

    return initial_groups

def calculate_objective(schedule) -> int:
    """
    Calculate the objective value of the schedule to penalize repeat games

    Args:
        schedule (list): List representing the schedule.

    Returns:
        int: Objective value.

    """
    all_matchups = [matchup for week in schedule for group in week for matchup in itertools.combinations(group, 2)]

    matchup_counts = defaultdict(int)
    for matchup in all_matchups:
        sorted_matchup = tuple(sorted(matchup))
        matchup_counts[sorted_matchup] += 1

    total_penalty = sum((count - 1) ** 2 for count in matchup_counts.values())

    return total_penalty

def generate_schedule(teams: list[str], num_wks: int, num_groups: int):
    """
    Generate a schedule.

    Args:
        teams (list): List of team identifiers.
        num_wks (int): Number of weeks in the schedule.
        num_groups (int): Number of groups.

    Returns:
        list[list[list]]: Generated schedule. (Weeks,groups,teams)

    """
    schedule = [[] for _ in range(num_wks)]

    initial_groups = divide_teams_evenly(teams, num_groups)

    for week in schedule:
        week.extend(copy.deepcopy(initial_groups))

    current_objective = calculate_objective(schedule)

    iterations = 100  # Adjust the number of iterations based on your needs

    for _ in range(iterations):
        for wk in range(1, num_wks):
            for gp in range(num_groups):
                for t in range(len(schedule[wk][gp])):
                    for gp2 in range(num_groups):
                        if gp2 == gp:
                            continue

                        t2 = random.randint(0, len(schedule[wk][gp2]) - 1)
                        schedule[wk][gp][t], schedule[wk][gp2][t2] = schedule[wk][gp2][t2], schedule[wk][gp][t]

                        new_objective = calculate_objective(schedule)

                        if new_objective < current_objective:
                            current_objective = new_objective
                        else:
                            schedule[wk][gp][t], schedule[wk][gp2][t2] = schedule[wk][gp2][t2], schedule[wk][gp][t]

    return schedule

def schedule_summary(result_schedule):
    """
    Generate a summary of the schedule.

    Args:
        result_schedule (list): Generated schedule.

    Returns:
        dict: Schedule summary.

    """
    all_matchups = [matchup for week in result_schedule for group in week for matchup in itertools.combinations(group, 2)]

    matchup_counts = Counter(all_matchups)

    most_played_matchup, most_played_count = max(matchup_counts.items(), key=lambda x: x[1])

    sorted_matchups = sorted(matchup_counts.items(), key=lambda x: x[1], reverse=True)

    summary = {
        "Most Played Matchup": most_played_matchup,
        "Times Played": most_played_count,
        # "All Matchups": sorted_matchups
    }

    return summary
