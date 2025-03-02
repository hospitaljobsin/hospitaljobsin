# PulseWork
> *recruitment and job seeking for medical professionals*

## Codebase Structure
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
| Tool           | Minimum Tested Version  | Description                 |
|----------------|-------------------------|-----------------------------|
| Docker Engine  | 4.35                    | Container runtime           |
| Tmuxinator     | 3.0                     | TMUX session manager        |

Go through the setup guides of the services above, which covers installation of required dependencies,
and other service specific setup tasks.

To start all services in development, run the following command:

```bash
tmuxinator start medical_jobs
```