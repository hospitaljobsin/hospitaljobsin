# TODO- seeker portal

- add job apply feature

- we need a separate resource that can return the searched jobs
aaa

- if prompt is show me jobs satisfying XXX conditions, we get a tool call done to call the appropriate jobs. we handle that and show the result client side.
- we can add other tools too, like showing current applications, saved jobs etcaaa

# TODO- recruiter portal
- list applications
- show applicant detail view
    - show applicant's form data
    - show applicant's job seeker profile
- group applications into stages:
    - waiting for review
    - waiting for interview
    - selected

# PulseWork
> *recruitment and job seeking for medical professionals*

## Codebase Structure

![Service Flowchart](./.github/assets/service-flowchart.png)

<!-- 
relevant UML code:

https://www.planttext.com?text=u-LoA2v9B2efpStXvShBJqbLK0eepIbE3SylobPmJ4xEByqhALPII2nM20Xtn501bS3K6PIQN5IQMP9Q15KHnCk5nVW0Jx0qa0P90orGqDMr0t4Lh1HAYrEBGM91MCGmX1nIyrB0FW00
-->

| Service             | Directory                                         | Description                     |
|---------------------|---------------------------------------------------|---------------------------------|
| PulseWork Accounts  | [apps/accounts](./apps/accounts)                  | Authentication/ Accounts UI     |
| PulseWork Recruiter | [apps/recruitment-portal](./apps/recruiter-portal)| Recruitment platform UI         |
| PulseWork           | [apps/seeker-portal](./apps/seeker-portal)        | Job Seeker platform UI          |
| PulseWork API       | [server](./server)                                | GraphQL API Server              |
| E2E Test Suite      | [e2e](./e2e)                                      | Playwright End-To-End Tests     |


## License
This project has a proprietary license. Read the entire license [here](./README.md)


## Local development- Quickstart

### Prerequisites
| Tool                                                       | Minimum Tested Version  | Description                 |
|------------------------------------------------------------|-------------------------|-----------------------------|
| [Docker Engine](https://docs.docker.com/engine/)           | 4.35                    | Container runtime           |
| [TMUX](https://github.com/tmux/tmux)                       | 3.2a                    | Terminal Multiplexer        |
| [Tmuxinator](https://github.com/tmuxinator/tmuxinator)     | 3.0                     | TMUX session manager        |

Go through the setup guides of the services above, which covers installation of required dependencies,
and other service specific setup tasks.

To start all services in development, run the following command:

```bash
tmuxinator start medical_jobs
```

### Running E2E tests
1. Stop the currently running services:
    ```bash
    tmuxinator stop medical_jobs
    ```
2. Start the docker compose E2E services:
    ```bash
    docker compose -f docker-compose.e2e.yml up --wait --build --remove-orphans -d
    ```

3. Run the E2E tests:
    ```bash
    cd e2e
    pnpm run test
    ```