// if the database is empty on server start, create some sample data.
Meteor.startup(function () {
  if (Workouts.find().count() === 0) {
    var standard = {
      "name": "Standard Workout",
      "sections": [
        {
          "name": "Warm Up",
          "movements": [
            {
              "name": "Run in Place",
              "count": 90
            },
            {
              "name": "Jumping Jacks",
              "count": 120
            },
            {
              "name": "March and Kick",
              "count": 45
            }
          ]
        },
        {
          "name": "Stretch",
          "movements": [
            {
              "name": "Standing Wide Feet Forward Bend",
              "count": 80
            },
            {
              "name": "Hamstring Stretch (Left)",
              "count": 40
            },
            {
              "name": "Hamstring Stretch (Right)",
              "count": 40
            },
            {
              "name": "Arm Circles",
              "count": 40
            },
            {
              "name": "Quad Stretch (Left)",
              "count": 40
            },
            {
              "name": "Quad Stretch (Right)",
              "count": 40
            }
          ]
        },
        {
          "name": "Plyo #1",
          "movements": [
            {
              "name": "Airborne Heisman",
              "count": 30
            },
            {
              "name": "Swing Kicks",
              "count": 30
            },
            {
              "name": "Jump Shot",
              "count": 30
            },
            {
              "name": "Tires",
              "count": 30
            },
            {
              "name": "Wacky Jacks",
              "count": 60,
              "cooldown": 20
            }
          ]
        },
        {
          "name": "Plyo #2",
          "movements": [
            {
              "name": "Airborne Heisman",
              "count": 30
            },
            {
              "name": "Swing Kicks",
              "count": 30
            },
            {
              "name": "Jump Shot",
              "count": 30
            },
            {
              "name": "Tires",
              "count": 30
            },
            {
              "name": "Wacky Jacks",
              "count": 60,
              "cooldown": 20
            }
          ]
        },
        {
          "name": "Core",
          "movements": [
            {
              "name": "Squat Cross X Press",
              "count": 30,
              "time_per": 3
            },
            {
              "name": "Push Ups",
              "count": 10,
              "time_per": 4
            },
            {
              "name": "Steam Engine",
              "count": 100,
              "cooldown": 30
            },
            {
              "name": "Push Ups",
              "count": 10,
              "time_per": 4
            },
            {
              "name": "Box Lifts (Left)",
              "count": 20,
              "time_per": 4
            },
            {
              "name": "Box Lifts (Right)",
              "count": 20,
              "time_per": 4,
              "cooldown": 30
            }
          ]
        },
        {
          "name": "Cool Down",
          "movements": [
            {
              "name": "Run in Place",
              "count": 60
            },
            {
              "name": "Jumping Jacks",
              "count": 30
            },
            {
              "name": "March and Kick",
              "count": 30
            },

          ]
        },
        {
          "name": "Final Stretch",
          "movements": [
            {
              "name": "Stir the Pot",
              "count": 30
            },
            {
              "name": "Standing Wide Feet Forward Bend",
              "count": 60
            },
            {
              "name": "Downward Facing Dog",
              "count": 60
            },
            {
              "name": "Cat Stretch",
              "count": 30
            },
            {
              "name": "Quad Stretch (Left)",
              "count": 30
            },
            {
              "name": "Quad Stretch (Right)",
              "count": 30
            }
          ]
        }
      ]
    };

    var sevenMinute = {
      "name": "Scientific 7-Minute Workout",
      "sections": [
        {
          "name": "7 Minutes",
          "defaultCooldown": 10,
          "movements": [
            {
              "name": "Jumping Jacks",
              "count": 30
            },
            {
              "name": "Wall Sit",
              "count": 30
            },
            {
              "name": "Push ups",
              "count": 30
            },
            {
              "name": "Abdominal Crunches",
              "count": 30
            },
            {
              "name": "Step Up on Chair",
              "count": 30
            },
            {
              "name": "Squats",
              "count": 30
            },
            {
              "name": "Tricep Dips on Chair",
              "count": 30
            },
            {
              "name": "Plank",
              "count": 30
            },
            {
              "name": "High Knee Run in Place",
              "count": 30
            },
            {
              "name": "Lunge",
              "count": 30
            },
            {
              "name": "Push ups with Rotation",
              "count": 30
            },
            {
              "name": "Side Plank",
              "count": 30
            }
          ]
        }
      ]
    };

    /*
      1. Bicep curl (10 reps)
      2. Reverse lunge (alternating) with bicep curl (20 reps)
      3. Plié squat (10 reps)
      4. Plié squat with upward row (10 reps)
      5. Dumbbell fly (10 reps)
      6. Reverse lunge (alternating) with dumbbell fly (20 reps)
      7. Add knee lifts, 20 reps
      8. Single leg deadlift, right side (10 reps)
      9. Single leg deadlift, left side (10 reps)
      10. Add knee lift, right side (10 reps)
      11. Add knee lift, left side (10 reps)
      12. Add overhead press, right side (10 reps)
      13. Add overhead press, left side (10 reps)
      14. Alternating reach (20 reps)
      15. Tricep pushup (20 reps)
      16. Alternating reach to tricep pushup (20 reps)
      17. Knee to elbow, right side (20 reps)
      18. Knee to elbow, left side (20 reps)
      19. Side leg kicks SLOW, right side (20 reps)
      20. Side leg kicks SLOW, left side (20 reps)
      21. Side leg kicks FAST, right side (20 reps)
      22. Side leg kicks FAST, left side (20 reps)
      23. Open arms (10 reps)
      24. Seated lift with open arms (20 reps)
      25. Seated tucks, arms at 90 degrees (20 reps)
      26. Hamstring curl, right side (10-20 reps)
      27. Hamstring curl, left side (10-20 reps)
      28. Hamstring curl with tricep kickbacks, right side (10-20 reps)
      29. Hamstring curl with tricep kickbacks, left side (10-20 reps)
      30. Extend right arm out, left leg pulse up (20 reps)
      31. Extend left arm out, right leg pulse up (20 reps)
      32. Stretch & cool down
    */

    var pregger = {
      "name": "Prenatal Workout",
      "sections": [
        {
          "name": "One",
          "default-cooldown": 5,
          "movements": []
        }
      ]
    };

    Workouts.insert(standard);
    Workouts.insert(sevenMinute);
  }
});
