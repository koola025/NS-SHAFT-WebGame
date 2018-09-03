# Software Studio 2018 Spring Assignment 02 小朋友下樓梯

## 小朋友下樓梯
<img src="example01.png" width="700px" height="500px"></img>

## Goal
1. **Fork the repo ,remove fork relationship and change project visibility to public.**
2. Complete a game "小朋友下樓梯" by Phaser. (JavaScript or TypeScript)
3. Your game should reach the basic requirements.
4. You can download needed materials from some open source webpage to beautify the appearance.
5. Commit to "your" project repository and deploy to Gitlab page.
6. **Report which items you have done and describing other functions or feature in REABME.md.**

## Scoring 
|                                              Item                                              | Score |
|:----------------------------------------------------------------------------------------------:|:-----:|
| A complete game process: start menu => game view => game over => quit or play again            |  20%  |
| Your game should follow the basic rules of  "小朋友下樓梯".                                    |  15%  |
|         All things in your game should have correct physical properties and behaviors.         |  15%  |
| Set up some interesting traps or special mechanisms. .(at least 2 different kinds of platform) |  10%  |
| Add some additional sound effects and UI to enrich your game.                                  |  10%  |
| Store player's name and score in firebase real-time database, and add a leaderboard to your game.        |  10%  |
| Appearance (subjective)                                                                        |  10%  |
| Other creative features in your game (describe on README.md)                                   |  10%  |

## Reminder
* Do not make any change to our root project repository.
* Deploy your web page to Gitlab page, and ensure it works correctly.
    * **Your main page should be named as ```index.html```**
    * **URL should be : https://[studentID].gitlab.io/Assignment_02**
* You should also upload all source code to iLMS.
    * .html or .htm, .css, .js, .ts, etc.
    * source files
* **Deadline: 2018/05/24 23:59 (commit time)**
    * Delay will get 0 point (no reason)
    * Copy will get 0 point
    * "屍體" and 404 is not allowed

## Report
### Demo Video:
![](demovideo.mov)
### A complete game process:
##### 1 player
loading => menu(click 1 player) => choose player => game view => game over(click try again) => menu

##### 2 player
loading => menu(click 2 player) => choose player1 => choose player2 => game view => game over(click try again) => menu

### Follow the basic rules:
- The player falls when not standing on any platforms.
- The player moves left and right according to the keyboard input. 
- The player's life decreases when it lands on nails or touches the ceiling.
- The player can get 1 life back if it lands on any platform besides nails.
- When the player falls all the way down or when its life is less or equal to 0, the game ends. (In two player mode, the game ends when both players are dead.)
- Score increases after particular amount of time.

### Correct physical properties and behaviors:
- The player has gravity.
- When the player collide with platform from above, it performs specific effect according to the platform.
- The player can't move further when it collides will walls.
- The player will be pushed down from platform if it touches the ceiling.

### Interesting traps or special mechanisms:
##### Fake Platform
The platform will turn after the player stood on it for 0.1 second, and the player will fall.

##### Conveyor Platform
The platform will give the player a speed on the x direction.

##### Trampoline Platform
The player can bounce on the trampoline.

##### Nails Platform
The player's life will decrease when standing on it.

##### Golden Platform
The player's life will become full and the player will enter "superman mode". It won't be hurt by nails or the ceiling in the next five seconds after entering "superman mode".

### Additional sound effects and UI:
##### Background Music
The background music starts playing when the game starts and loops itself. When the game is paused, it pauses too.
##### Platform Sound Effects
Each platform has its corresponding sound effects. (When the player is in superman mode, the nails has the same sound as normal platform.)
##### Player Fall Sound Effect
When the player falls all the way down, there's a shouting sound effect.

##### Player Animation
The player has different animation when moving in different direction or flying.

##### Platform Animation
Conveyor platforms, trampoline platforms, fake platforms, golden platforms each has its corresponding animation.

##### Life Bar Animation
The life of player is diplayed by the life bar, which can be increased or decreased.

##### Camera Flash
1. When the player is hurt, the screen flashes red.
2. In superman mode, the screen flashes yellow.

##### Die Particles
When player dies, it emits particle.

##### Choose Player animation
In the choose player page, the players performs flying animation, and it flies up and back down (yoyo effect) when mouse over.
 
### Player's name and score and leaderboard:
When player dies, they can choose to enter their name, and the name and score will be stored in firebase. The leaderboard on the menu page will show 5 players with the highest scores in order.

### Other creative features:
##### Two Player Mode
Two players can play together.(player1: left/right, player2: A/D)

##### Pause/Abort
Click on "pause" to pause the game and click again to resume. Click on abort to go back to the menu.

##### Choose Player
People can choose to play with different players. In two player mode, player2 can't choose the same player that player1 has chosen.

##### Superman Mode
Player won't be hurt by nails or the ceiling for five seconds after landing on the golden platform.

