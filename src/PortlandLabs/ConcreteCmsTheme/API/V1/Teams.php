<?php

/**
 * @project:   ConcreteCMS Theme
 *
 * @copyright  (C) 2021 Portland Labs (https://www.portlandlabs.com)
 * @author     Fabian Bitter (fabian@bitter.de)
 */

namespace PortlandLabs\ConcreteCmsTheme\API\V1;

use Concrete\Core\Application\EditResponse;
use Concrete\Core\Error\ErrorList\ErrorList;
use Concrete\Core\Http\Request;
use PortlandLabs\ConcreteCmsTheme\TeamsService;
use Symfony\Component\HttpFoundation\JsonResponse;

class Teams
{
    protected $request;
    protected $teamsService;

    public function __construct(
        Request $request,
        TeamsService $teamsService
    )
    {
        $this->request = $request;
        $this->teamsService = $teamsService;
    }

    public function search()
    {
        $response = new EditResponse();
        $errorList = new ErrorList();

        if ($this->request->request->has("keywords")) {
            $keywords = (string)$this->request->request->get("keywords");
            $response->setAdditionalDataAttribute("teams", $this->teamsService->searchTeams($keywords));
        } else {
            $errorList->add(t("You need to enter a search term."));
        }

        $response->setError($errorList);
        return new JsonResponse($response);
    }
}