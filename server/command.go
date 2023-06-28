package main

import (
	"context"
	"fmt"
	"regexp"
	"strings"

	"github.com/mattermost/mattermost-server/v6/model"
	"github.com/mattermost/mattermost-server/v6/plugin"
)

const (
	listPagesCommand  = "list"
	singlePageCommand = "single"
)

var validCommand = map[string]bool{
	listPagesCommand:  true,
	singlePageCommand: true,
}

func getCommand() *model.Command {
	return &model.Command{
		Trigger:          "wikijs",
		DisplayName:      "Wiki.Js Bot",
		Description:      "Interact with your Wiki.js",
		AutoComplete:     true,
		AutoCompleteDesc: "Available command: list",
		AutoCompleteHint: "[command]",
		AutocompleteData: getAutoCompleteData(),
	}
}

func (p *Plugin) ExecuteCommand(c *plugin.Context, args *model.CommandArgs) (*model.CommandResponse, *model.AppError) {
	spaceRegExp := regexp.MustCompile(`\s+`)
	trimmedArgs := spaceRegExp.ReplaceAllString(strings.TrimSpace(args.Command), " ")
	stringArgs := strings.Split(trimmedArgs, " ")
	lengthOfArgs := len(stringArgs)
	restOfArgs := []string{}

	var handler func([]string, *model.CommandArgs) (bool, error)
	if lengthOfArgs == 1 {
		handler = p.runListCommand
	}
	handler = p.runListCommand
	isUserError, err := handler(restOfArgs, args)
	if err != nil {
		if isUserError {
			fmt.Println(err.Error())
		}
	}
	return &model.CommandResponse{}, nil
}

func (p *Plugin) runListCommand(args []string, extra *model.CommandArgs) (bool, error) {

	graphqlClient, err := p.GetOAuth2Client()

	if err != nil {
		p.postCommandResponse(extra, "Something wrong in Api Key or Host")
	}

	resp, err := listPages(context.Background(), graphqlClient)

	if err != nil {
		fmt.Print("error")
	}

	table := "| ID | Title | Path | CreatedAt | UpdatedAt |\n|----|-------|-------|-------|-------|\n"
	for _, item := range resp.GetPages().List {
		table += fmt.Sprintf("| %d | %s | %s | %s | %s |\n", item.GetId(), item.GetTitle(), item.Path, item.CreatedAt, item.UpdatedAt)
	}

	p.postCommandResponse(extra, table)

	return false, nil
}

func (p *Plugin) postCommandResponse(args *model.CommandArgs, text string) {
	post := &model.Post{
		UserId:    p.BotUserID,
		ChannelId: args.ChannelId,
		Message:   text,
	}
	_ = p.API.SendEphemeralPost(args.UserId, post)
}

func getAutoCompleteData() *model.AutocompleteData {
	wikijs := model.NewAutocompleteData("wikijs", "[command]", "Available commands: list")
	list := model.NewAutocompleteData("list", "[order]", "Lists your wiki")
	items := []model.AutocompleteListItem{
		{
			HelpText: "OrderById",
			Hint:     "(optional)",
			Item:     "id",
		}, {
			HelpText: "OrderByTime",
			Hint:     "(optional)",
			Item:     "time",
		},
	}

	list.AddStaticListArgument("Lists your wiki.js", false, items)
	wikijs.AddCommand(list)
	return wikijs
}
