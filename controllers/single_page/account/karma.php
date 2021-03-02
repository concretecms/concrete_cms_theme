<?php /** @noinspection PhpInconsistentReturnPointsInspection */
/** @noinspection PhpUnused */

/**
 * @project:   ConcreteCMS Theme
 *
 * @copyright  (C) 2021 Portland Labs (https://www.portlandlabs.com)
 * @author     Fabian Bitter (fabian@bitter.de)
 */

namespace Concrete\Package\ConcreteCmsTheme\Controller\SinglePage\Account;

use Concrete\Core\Database\Connection\Connection;
use Concrete\Core\Search\Pagination\Pagination;
use Concrete\Core\Search\Pagination\PaginationFactory;
use Concrete\Core\Support\Facade\Url;
use Concrete\Core\User\Point\Entry;
use Concrete\Core\User\Point\EntryList as UserPointEntryList;
use Concrete\Core\User\User;
use PortlandLabs\ConcreteCmsTheme\Page\Controller\AccountPageController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Concrete\Core\Localization\Service\Date;
use Exception;

class Karma extends AccountPageController
{
    /** @var Connection */
    protected $db;
    /** @var User */
    protected $user;
    /** @var Date $dateService */
    protected $dateService;

    public function on_start()
    {
        parent::on_start();
        $this->db = $this->app->make(Connection::class);
        $this->user = new User();
        $this->dateService = $this->app->make(Date::class);
    }

    private function getActionList()
    {
        $actionList = [];

        foreach ($this->db->fetchAll("SELECT upaID, upaName FROM UserPointActions") as $row) {
            $actionList[$row["upaID"]] = $row["upaName"];
        }

        return $actionList;
    }

    private function getMyTotalList()
    {
        $myTotalList = [];

        foreach ($this->getActionList() as $actionId => $actionName) {
            $totalByAction = (int)$this->db->fetchColumn("SELECT SUM(upPoints) FROM UserPointHistory WHERE upaID = ? AND upuID = ?", [
                $actionId,
                $this->user->getUserID()
            ]);

            if ($totalByAction > 0) {
                $myTotalList[$actionName] = $totalByAction;
            }
        }

        return $myTotalList;
    }

    public function fetch_results()
    {
        $results = [];

        $entryList = new UserPointEntryList();
        $entryList->setItemsPerPage(100);
        $entryList->sortBy('uph.timestamp', 'desc');
        /** @var PaginationFactory $factory */
        $factory = $this->app->make(PaginationFactory::class, [$this->request]);
        /** @var Pagination $pagination */
        $pagination = $factory->createPaginationObject($entryList);

        foreach ($pagination->getCurrentPageResults() as $entry) {
            $result = [];

            /** @var Entry $entry */
            $targetUser = new User($entry->getUserPointEntryUserID());
            $result["avatar"] = $targetUser->getUserInfoObject()->getUserAvatar()->getPath();
            $result["username"] = $targetUser->getUserName();

            try {
                $date = $this->dateService->formatDateTime($entry->getUserPointEntryDateTime());
            } catch (Exception $e) {
                $date = t("n/a");
            }

            /** @noinspection HtmlUnknownTarget */
            $result["info"] = t("Awarded to %s on %s",
                sprintf(
                    "<a href=\"%s\">%s</a>",
                    (string)Url::to("/members/profile", $entry->getUserPointEntryUserID()),
                    $targetUser->getUserName()
                ),
                $date
            );

            if (is_object($entry->getUserPointEntryActionObject())) {
                $result["title"] = $entry->getUserPointEntryActionObject()->getUserPointActionName();
            } else {
                $result["title"] = t("Received Extra-Karma");
            }

            if (strlen($entry->getUserPointEntryDescription()) > 0) {
                $result["description"] = $entry->getUserPointEntryDescription();
            } else {
                $result["description"] = t("Thanks for taking the time!");
            }

            $result["points"] = number_format($entry->getUserPointEntryValue());

            $results[] = $result;
        }

        return new JsonResponse([
            "results" => $results,
            "hasNextPage" => $pagination->hasNextPage()
        ]);
    }

    public function view()
    {
        $entryList = new UserPointEntryList();
        $entryList->setItemsPerPage(100);
        $entryList->sortBy('uph.timestamp', 'desc');
        /** @var PaginationFactory $factory */
        $factory = $this->app->make(PaginationFactory::class, [$this->request]);
        /** @var Pagination $pagination */
        $pagination = $factory->createPaginationObject($entryList);
        $entries = $pagination->getCurrentPageResults();

        $this->set('entries', $entries);
        $this->set('myTotalList', $this->getMyTotalList());
        $this->set('hasNextPage', $pagination->hasNextPage());


    }
}