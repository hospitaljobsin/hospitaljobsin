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

PLAYWRIGHT SETUP REFERENCE:
- https://github.com/Netflix/dispatch/blob/main/.github/workflows/playwright.yml
- https://github.com/Netflix/dispatch/blob/main/playwright.config.ts

E2E todo:
- tests are failing because recaptcha mode doesn't load in headless browsers where the user agent is detected as a bot (github actions)
- we need to mock recaptcha for testing
- in the server, separate recaptcha solving into a separate service. in the service getter via aioinject, conditionally return the service based on the current mode (testing or prod)
- in the frontend, mock the recaptcha lib to always return a constant token like XXX which the mock recaptcha service always accepts